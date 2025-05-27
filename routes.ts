/**
 *these are the routes that donot require authhentication
 *@type {string[]}
 */
export const PublicRoutes = ["/", "/auth/new-verification", "/auth/onboarding"];
/**
 *these are the routes that require authhentication
 *@type {string[]}
 */

export const AuthRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];
/** 
    the prefix for api authentication routes 
    Routes that start with this prefix are used for API
    authentication purposes
    *@type {string}
    */
export const ApiAuthPrefix = "/api/auth";

/** 
    default redirect path after the logging in
    @type {string}
    */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
