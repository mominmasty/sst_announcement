import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, adminLimiterOptions } from '@/lib/middleware/rateLimit';
import { requireAuth, requireSuperAdmin } from '@/lib/middleware/auth';
import { requireAllowedDomain } from '@/lib/middleware/domain';
import { updateUserRole, getUserById } from '@/lib/data/users';
import { BadRequestError, NotFoundError } from '@/lib/utils/errors';
import type { UserRole } from '@/lib/types/index';

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
    requireSuperAdmin(user); // Only super admins can change roles

    const { id: idParam } = await params;
    const id = parseId(idParam);
    const body = await request.json();

    if (!body.role || typeof body.role !== 'string') {
      throw new BadRequestError('Role is required and must be a string');
    }

    const validRoles: UserRole[] = ['student', 'student_admin', 'admin', 'super_admin'];
    if (!validRoles.includes(body.role as UserRole)) {
      throw new BadRequestError(`Role must be one of: ${validRoles.join(', ')}`);
    }

    // Check if user exists
    const targetUser = await getUserById(id);
    if (!targetUser) {
      throw new NotFoundError('User', id);
    }

    const updatedUser = await updateUserRole(id, body.role as UserRole);

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `User role updated to ${body.role}`,
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
