import { getUser, signIn, signOut } from '@workos-inc/authkit-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { user } = await getUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Map WorkOS user to our application user format
    const appUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.email === 'admin@akademyx.com' ? 'admin' : 'user', // Simple admin detection
    };

    return NextResponse.json(appUser);
  } catch (error) {
    console.error('Auth user error:', error);
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}