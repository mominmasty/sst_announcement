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

    console.log(`Redirect API called for announcement ${announcementId}`);

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

    if (!spooShortCode && !link) {
      return NextResponse.json(
        { success: false, error: 'No URL available for this announcement' },
        { status: 404 }
      );
    }

    // Try to get the authenticated user for click tracking
    let userId: number | undefined;
    try {
      const user = await requireAuth(request, { enforceDomain: false });
      userId = user.id;
      console.log('Authenticated user for click tracking:', userId);
    } catch (error) {
      // User not authenticated, continue with anonymous tracking
      console.log('Anonymous click tracking (user not authenticated)');
    }

    // Log the click in our database (even for anonymous users)
    try {
      await db.insert(clickTracking).values({
        userId: userId || null, // Allow null for anonymous clicks
        announcementId: Number(announcementId),
      });
      console.log(`Click tracked for announcement ${announcementId}, user: ${userId || 'anonymous'}`);
    } catch (error) {
      console.error('Error logging click tracking:', error);
      // Continue with redirect even if logging fails
    }

    // Redirect to Spoo.me URL if available, otherwise redirect to original link
    if (spooShortCode) {
      const spooUrl = `https://spoo.me/${spooShortCode}`;
      return NextResponse.redirect(spooUrl, { status: 307 });
    } else {
      // Fallback to original link if no Spoo.me short code
      return NextResponse.redirect(link!, { status: 307 });
    }

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