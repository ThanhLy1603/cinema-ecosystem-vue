import type { User } from '@/types/auth/auth';

const DEFAULT_REDIRECT_PATH: string = '/';
const STAFF_HOME_PATH: string = '/staff';

function isSafeInternalPath(pathname: string): boolean {
   return pathname.startsWith('/') && !pathname.startsWith('//');
}

export function getRedirectPath(redirectQuery: unknown): string {
   if (typeof redirectQuery === 'string' && isSafeInternalPath(redirectQuery)) {
      return redirectQuery;
   }
   return DEFAULT_REDIRECT_PATH;
}

export function getPostLoginPath(redirectPath: string, user: Pick<User, 'roles'> | null): string {
   if (redirectPath !== DEFAULT_REDIRECT_PATH || user === null) {
      return redirectPath;
   }
   const isStaffOnly: boolean =
      user.roles.includes('ROLE_STAFF') && !user.roles.includes('ROLE_MANAGER') && !user.roles.includes('ROLE_ADMIN');
   return isStaffOnly ? STAFF_HOME_PATH : redirectPath;
}
