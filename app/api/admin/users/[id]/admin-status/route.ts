import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, adminLimiterOptions } from '@/lib/middleware/rateLimit';
import { requireAuth, requireSuperAdmin } from '@/lib/middleware/auth';
import { requireAllowedDomain } from '@/lib/middleware/domain';
import { updateUserAdminStatus, getUserById } from '@/lib/data/users';
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await applyRateLimit(request, adminLimiterOptions);
    const user = await requireAuth(request, { enforceDomain: true });
    requireAllowedDomain(user);
    requireSuperAdmin(user); // Only super admins can change admin status

    const { id: idParam } = await params;
    const id = parseId(idParam);
    const body = await request.json();

    if (typeof body.is_admin !== 'boolean') {
      throw new BadRequestError('is_admin is required and must be a boolean');
    }

    // Check if user exists
    const targetUser = await getUserById(id);
    if (!targetUser) {
      throw new NotFoundError('User', id);
    }

    const updatedUser = await updateUserAdminStatus(id, body.is_admin);

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `User admin status updated to ${body.is_admin ? 'admin' : 'student'}`,
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
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
