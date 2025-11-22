import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, generalLimiterOptions } from '@/lib/middleware/rateLimit';
import { requireAuth } from '@/lib/middleware/auth';
import { getDb } from '@/lib/config/db';
import { announcements, clickTracking } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await applyRateLimit(request, generalLimiterOptions);

    const { searchParams } = new URL(request.url);
    const announcementId = searchParams.get('announcementId');

    if (!announcementId || isNaN(Number(announcementId))) {
      return NextResponse.json(
        { success: false, error: 'Valid announcementId is required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Get the announcement to check if it exists and get the spoo_short_code
    const announcement = await db
      .select({
        id: announcements.id,
        spooShortCode: announcements.spooShortCode,
        link: announcements.link,
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

    const { spooShortCode, link } = announcement[0];

    if (!spooShortCode) {
      return NextResponse.json(
        { success: false, error: 'No shortened URL available for this announcement' },
        { status: 404 }
      );
    }

    // Try to get the authenticated user for click tracking
    let userId: number | undefined;
    try {
      const user = await requireAuth(request, { enforceDomain: false });
      userId = user.id;
    } catch (error) {
      // User not authenticated, continue without user tracking
      console.log('User not authenticated for click tracking');
    }

    // Log the click in our database
    if (userId) {
      try {
        await db.insert(clickTracking).values({
          userId,
          announcementId: Number(announcementId),
        });
      } catch (error) {
        console.error('Error logging click tracking:', error);
        // Continue with redirect even if logging fails
      }
    }

    // Redirect to Spoo.me URL
    const spooUrl = `https://spoo.me/${spooShortCode}`;
    return NextResponse.redirect(spooUrl, { status: 307 });

  } catch (error: any) {
    console.error('Error in redirect-announcement:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: error.status || 500 }
    );
  }
}