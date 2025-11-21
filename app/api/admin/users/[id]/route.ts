import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, adminLimiterOptions } from '@/lib/middleware/rateLimit';
import { requireAuth, requireAdmin } from '@/lib/middleware/auth';
import { requireAllowedDomain } from '@/lib/middleware/domain';
import { getUserById } from '@/lib/data/users';
import { BadRequestError, NotFoundError } from '@/lib/utils/errors';

function parseId(id: string): number {
  if (!id) {
    throw new BadRequestError('User ID is required');
  }
  const parsed = Number(id);
  if (Number.isNaN(parsed)) {
    throw new BadRequestError('User ID must be a valid number');
  }
  return parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await applyRateLimit(request, adminLimiterOptions);
    const user = await requireAuth(request, { enforceDomain: true });
    requireAllowedDomain(user);
    requireAdmin(user);

    const { id: idParam } = await params;
    const id = parseId(idParam);
    const targetUser = await getUserById(id);
    if (!targetUser) {
      throw new NotFoundError('User', id);
    }

    return NextResponse.json({ success: true, data: targetUser });

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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
