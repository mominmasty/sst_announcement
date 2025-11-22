import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, generalLimiterOptions } from '@/lib/middleware/rateLimit';

export async function POST(request: NextRequest) {
  try {
    await applyRateLimit(request, generalLimiterOptions);
    
    const body = await request.json();
    const { announcement_id, event_type } = body;

    // For now, just return success without actually tracking
    // In a real implementation, you would save this to a database

    return NextResponse.json({
      success: true,
      data: { message: 'Event tracked successfully' },
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
