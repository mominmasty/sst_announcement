import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, adminLimiterOptions } from '@/lib/middleware/rateLimit';
import { requireAuth, requireAdmin } from '@/lib/middleware/auth';
import { requireAllowedDomain } from '@/lib/middleware/domain';
import { getDb } from '@/lib/config/db';
import { announcements } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getSpooStats } from '@/lib/services/spoo';

export async function GET(request: NextRequest) {
  try {
    await applyRateLimit(request, adminLimiterOptions);
    const user = await requireAuth(request, { enforceDomain: true });
    requireAllowedDomain(user);
    requireAdmin(user);

    const { searchParams } = new URL(request.url);
    const announcementId = searchParams.get('announcementId');

    if (!announcementId || isNaN(Number(announcementId))) {
      return NextResponse.json(
        { success: false, error: 'Valid announcementId is required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Get the announcement to check if it has a Spoo.me short code
    const announcement = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        spooShortCode: announcements.spooShortCode,
      })
      .from(announcements)
      .where(eq(announcements.id, Number(announcementId)))
      .limit(1);

    if (!announcement.length) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found' },
        { status: 404 }
      );
    }

    const { spooShortCode } = announcement[0];

    if (!spooShortCode) {
      return NextResponse.json({
        success: true,
        data: {
          announcementId: Number(announcementId),
          title: announcement[0].title,
          total_clicks: 0,
          message: 'No Spoo.me short code available for this announcement',
        },
      });
    }

    // Fetch stats from Spoo.me
    const spooStats = await getSpooStats(spooShortCode);

    if (spooStats.success) {
      return NextResponse.json({
        success: true,
        data: {
          announcementId: Number(announcementId),
          title: announcement[0].title,
          total_clicks: spooStats.total_clicks || 0,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: spooStats.error || 'Failed to fetch Spoo.me stats',
      });
    }

  } catch (error: any) {
    console.error('Error in spoo-stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: error.status || 500 }
    );
  }
}