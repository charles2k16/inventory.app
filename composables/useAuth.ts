/**
 * Auth composable: current user and role-based permissions.
 * Admin – full access. Manager – products, stock, weekly reports. Sales – POS, sales, lenders only.
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SALES: 'SALES',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

/** Parsed shape from localStorage; role can be legacy 'STAFF' or current UserRole */
interface StoredUser {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const u: StoredUser = JSON.parse(raw);
    if (!u?.id || !u?.username) return null;
    const role: UserRole =
      u.role === 'STAFF' || u.role === ROLES.SALES ? ROLES.SALES
        : u.role === ROLES.MANAGER ? ROLES.MANAGER
        : u.role === ROLES.ADMIN ? ROLES.ADMIN
        : ROLES.SALES;
    return {
      id: u.id,
      username: u.username,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role,
    };
  } catch {
    return null;
  }
}

function hasRole(user: AuthUser | null, allowed: UserRole[]): boolean {
  return user?.role != null && allowed.includes(user.role);
}

export function useAuth() {
  const user = ref<AuthUser | null>(getStoredUser());

  const isAdmin = computed(() => user.value?.role === ROLES.ADMIN);
  const isManager = computed(() => user.value?.role === ROLES.MANAGER);
  const isSales = computed(() => user.value?.role === ROLES.SALES);

  const canManageProducts = computed(() =>
    hasRole(user.value, [ROLES.ADMIN, ROLES.MANAGER])
  );
  const canManageStock = computed(() =>
    hasRole(user.value, [ROLES.ADMIN, ROLES.MANAGER])
  );
  const canManageReports = computed(() =>
    hasRole(user.value, [ROLES.ADMIN, ROLES.MANAGER])
  );
  const canManageReturns = computed(() =>
    hasRole(user.value, [ROLES.ADMIN, ROLES.MANAGER])
  );
  const canViewActivity = computed(() => hasRole(user.value, [ROLES.ADMIN]));

  function setUser(u: AuthUser | null) {
    user.value = u;
  }

  function refreshUser() {
    user.value = getStoredUser();
  }

  return {
    user,
    isAdmin,
    isManager,
    isSales,
    canManageProducts,
    canManageStock,
    canManageReports,
    canManageReturns,
    canViewActivity,
    setUser,
    refreshUser,
    ROLES,
  };
}
