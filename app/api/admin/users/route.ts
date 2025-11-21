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

    // Get all users
    const users = await getAllUsers();
    let usersWithRoles = users.map((item: any) => ({
      ...item,
      role: item.role || 'student',
      role_display: item.role === 'super_admin' ? 'Super Admin' : 
                   item.role === 'admin' ? 'Admin' : 
                   item.role === 'student_admin' ? 'Student Admin' : 'Student',
    }));

    // Handle search functionality
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      const searchResults = usersWithRoles.filter((user: any) => 
        user.email && user.email.toLowerCase().includes(email.toLowerCase())
      );
      
      return NextResponse.json({
        success: true,
        data: searchResults,
      });
    }

    return NextResponse.json({
      success: true,
      data: usersWithRoles,
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
