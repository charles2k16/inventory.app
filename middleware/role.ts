/**
 * Protects routes by role. Use definePageMeta({ middleware: 'role', role: 'manageProducts' }) etc.
 * Redirects to home if user lacks permission.
 */
export default defineNuxtRouteMiddleware((to) => {
  const required = to.meta.role as string | undefined;
  if (!required) return;

  if (import.meta.server) return;

  const { canManageProducts, canManageStock, canManageReports, canManageReturns, canViewActivity } =
    useAuth();

  const map: Record<string, boolean> = {
    manageProducts: canManageProducts.value,
    manageStock: canManageStock.value,
    manageReports: canManageReports.value,
    manageReturns: canManageReturns.value,
    viewActivity: canViewActivity.value,
  };

  if (map[required] === false) {
    return navigateTo('/', { replace: true });
  }
});
