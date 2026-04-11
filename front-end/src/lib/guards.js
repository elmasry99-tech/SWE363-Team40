import { getDefaultRouteForRole } from "./routes";

export function isAllowedRole(role, allowedRoles) {
  return Boolean(role && allowedRoles.includes(role));
}

export function resolveGuardRedirect(role, allowedRoles) {
  if (!role) return "/";
  if (allowedRoles.includes(role)) return null;
  return getDefaultRouteForRole(role);
}
