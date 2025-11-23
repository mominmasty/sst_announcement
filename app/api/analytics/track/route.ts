import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, generalLimiterOptions } from '@/lib/middleware/rateLimit';
import { requireAuth } from '@/lib/middleware/auth';
import { getDb } from '@/lib/config/db';
import { announcements, announcementEngagements, clickTracking } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    await applyRateLimit(request, generalLimiterOptions);
    
    const body = await request.json();
    const { announcement_id, event_type } = body;

    if (!announcement_id || !event_type) {
      return NextResponse.json(
        { success: false, error: 'announcement_id and event_type are required' },
        { status: 400 }
      );
    }

    // Get the authenticated user (may be null for anonymous users)
    let user = null;
    try {
      user = await requireAuth(request, { enforceDomain: false });
    } catch (authError) {
      // User is not authenticated, continue with null user
      console.log(`Anonymous user tracking ${event_type} for announcement ${announcement_id}`);
    }

    const db = getDb();
    console.log(`Database connection established for ${event_type} tracking`);

    // Verify the announcement exists
    const announcement = await db
      .select({ id: announcements.id })
      .from(announcements)
      .where(eq(announcements.id, announcement_id))
      .limit(1);

    if (!announcement.length) {
      console.log(`Announcement ${announcement_id} not found`);
      return NextResponse.json(
        { success: false, error: 'Announcement not found' },
        { status: 404 }
      );
    }

    console.log(`Announcement ${announcement_id} found, processing ${event_type} event`);

    if (event_type === 'view') {
      // Track view event
      try {
        await db.insert(announcementEngagements).values({
          announcementId: announcement_id,
          userId: user?.id || null,
          eventType: 'view',
        });
        console.log(`View event tracked for announcement ${announcement_id}`);

        // Increment views count
        await db
          .update(announcements)
          .set({ viewsCount: sql`${announcements.viewsCount} + 1` })
          .where(eq(announcements.id, announcement_id));
        console.log(`Views count incremented for announcement ${announcement_id}`);
      } catch (dbError) {
        console.error(`Database error tracking view for announcement ${announcement_id}:`, dbError);
        throw dbError;
      }

    } else if (event_type === 'click') {
      // Track click event
      console.log(`Tracking click for announcement ${announcement_id}, user: ${user?.id || 'anonymous'}`);
      try {
        await db.insert(clickTracking).values({
          announcementId: announcement_id,
          userId: user?.id || null,
        });
        console.log(`Click tracked successfully for announcement ${announcement_id}`);

        // Increment clicks count
        await db
          .update(announcements)
          .set({ clicksCount: sql`${announcements.clicksCount} + 1` })
          .where(eq(announcements.id, announcement_id));
        console.log(`Clicks count incremented for announcement ${announcement_id}`);
      } catch (dbError) {
        console.error(`Database error tracking click for announcement ${announcement_id}:`, dbError);
        throw dbError;
      }

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid event_type. Must be "view" or "click"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Event tracked successfully' },
    });

  } catch (error: any) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: error.status || 500 }
    );
  }
}

