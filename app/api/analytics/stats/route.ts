import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, adminLimiterOptions } from '@/lib/middleware/rateLimit';
import { requireAuth, requireAdmin } from '@/lib/middleware/auth';
import { requireAllowedDomain } from '@/lib/middleware/domain';
import { getDb } from '@/lib/config/db';
import { announcements, clickTracking } from '@/lib/schema';
import { sql, count, eq } from 'drizzle-orm';
import { getSpooStats } from '@/lib/services/spoo';

export async function GET(request: NextRequest) {
  try {
    await applyRateLimit(request, adminLimiterOptions);
    const user = await requireAuth(request, { enforceDomain: true });
    requireAllowedDomain(user);
    requireAdmin(user);

    const db = getDb();

    // Get total announcements
    const totalAnnouncementsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(announcements);
    const total_announcements = totalAnnouncementsResult[0]?.count || 0;

    // Get total users (from click tracking - unique users who clicked)
    const totalUsersResult = await db
      .select({ count: sql<number>`count(distinct user_id)` })
      .from(clickTracking)
      .where(sql`${clickTracking.userId} is not null`); // Only count authenticated users
    const total_users = totalUsersResult[0]?.count || 0;

    // Get active users (users who clicked in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsersResult = await db
      .select({ count: sql<number>`count(distinct user_id)` })
      .from(clickTracking)
      .where(sql`${clickTracking.createdAt} >= ${thirtyDaysAgo} and ${clickTracking.userId} is not null`);
    const active_users = activeUsersResult[0]?.count || 0;

    // Get top announcements by unique clicks (including both authenticated and anonymous users)
    const topAnnouncementsResult = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        uniqueClicks: sql<number>`count(distinct ${clickTracking.userId})`,
        totalClicks: sql<number>`count(${clickTracking.id})`,
      })
      .from(announcements)
      .leftJoin(clickTracking, eq(announcements.id, clickTracking.announcementId))
      .groupBy(announcements.id, announcements.title)
      .orderBy(sql`count(${clickTracking.id}) desc`) // Order by total clicks instead of unique authenticated users
      .limit(10);

    const top_announcements = topAnnouncementsResult.map(row => ({
      id: row.id,
      title: row.title,
      views: row.totalClicks, // Using total clicks as "views" to show all activity
      uniqueClicks: row.uniqueClicks, // Keep unique authenticated clicks for reference
    }));

    return NextResponse.json({
      success: true,
      data: {
        total_announcements,
        total_views: 0, // Keeping for compatibility, could be total clicks from Spoo.me
        total_users,
        active_users,
        top_announcements,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: error.status || 500 }
    );
  }
}


