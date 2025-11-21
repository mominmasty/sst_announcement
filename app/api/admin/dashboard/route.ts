import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, adminLimiterOptions } from '@/lib/middleware/rateLimit';
import { requireAuth, requireAdmin } from '@/lib/middleware/auth';
import { requireAllowedDomain } from '@/lib/middleware/domain';
import { getAllUsers } from '@/lib/data/users';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    await applyRateLimit(request, adminLimiterOptions);
    
    // Authentication and authorization
    const user = await requireAuth(request, { enforceDomain: true });
    requireAllowedDomain(user);
    requireAdmin(user);

    const users = await getAllUsers();
    const roleCounts = users.reduce(
      (acc: Record<string, number>, item: any) => {
        const role = item.role || 'student';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      { student: 0, student_admin: 0, admin: 0, super_admin: 0 }
    );

    const recentUsers = users.slice(0, 5).map((item: any) => ({
      ...item,
      role: item.role || 'student',
      role_display: item.role === 'super_admin' ? 'Super Admin' : 
                   item.role === 'admin' ? 'Admin' : 
                   item.role === 'student_admin' ? 'Student Admin' : 'Student',
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: users.length,
        studentUsers: roleCounts.student,
        studentAdminUsers: roleCounts.student_admin,
        adminUsers: roleCounts.admin,
        superAdminUsers: roleCounts.super_admin,
        recentUsers,
        roleBreakdown: {
          student: roleCounts.student,
          student_admin: roleCounts.student_admin,
          admin: roleCounts.admin,
          super_admin: roleCounts.super_admin,
        },
        endpoints: {
          getAllUsers: 'GET /api/admin/users',
          getUserById: 'GET /api/admin/users/:id',
          updateAdminStatus: 'PATCH /api/admin/users/:id/admin-status',
          updateUserRole: 'PATCH /api/admin/users/:id/role',
          searchUser: 'GET /api/admin/users?email=example@email.com',
        },
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
