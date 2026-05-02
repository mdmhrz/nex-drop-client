/**
 * Implementation Checklist & Configuration Guide
 * 
 * Complete step-by-step guide to implement the auth system
 */

// ============================================
// STEP 1: VERIFY FILE STRUCTURE
// ============================================
export const STEP_1_CHECK_FILES = `
✓ Files Created:
  - src/middleware.ts .......................... Main middleware file
  - src/lib/jwtUtils.ts ........................ JWT utilities
  - src/lib/authUtils.ts ....................... Route config & auth logic
  - src/lib/tokenUtils.ts ...................... Token expiry utilities
  - src/lib/auth.ts ............................ Updated with new functions
  - src/lib/rbac.ts ............................ Updated with permissions
  - src/lib/authHelpers.ts ..................... Helper functions
  - public/docs/AUTH_GUIDE.md .................. Documentation
  - src/app/api/example-routes.ts ............. API examples
  - src/app/api/edge-cases-testing.ts ......... Edge case scenarios

✓ Check all files exist and have correct content
✓ No syntax errors in any files
`;

// ============================================
// STEP 2: ENVIRONMENT SETUP
// ============================================
export const STEP_2_ENV_VARS = `
Add to .env.local or .env files:

NEXT_PUBLIC_JWT_SECRET=your-actual-secret-key-here
NEXT_PUBLIC_TOKEN_REFRESH_URL=/api/auth/refresh
NEXT_PUBLIC_TOKEN_EXPIRY_THRESHOLD=300

Notes:
- JWT_SECRET should match your backend JWT secret
- TOKEN_REFRESH_URL should point to your refresh endpoint
- TOKEN_EXPIRY_THRESHOLD is in seconds (300 = 5 minutes)
`;

// ============================================
// STEP 3: UPDATE NEXT.CONFIG
// ============================================
export const STEP_3_NEXT_CONFIG = `
Ensure next.config.ts includes middleware configuration:

// If using middleware, it should work automatically
// But verify your next.config.ts doesn't disable it

// If you have custom webpack config, ensure it doesn't interfere
`;

// ============================================
// STEP 4: UPDATE ROUTE STRUCTURE
// ============================================
export const STEP_4_ROUTES = `
Current Route Structure:

✓ Public Routes:
  / ............................ Home page
  /(public)/* ................... Public pages

✓ Auth Routes (No Auth Required):
  /login ....................... Login page
  /register .................... Registration page
  /(auth)/* .................... All auth pages

✓ Protected Routes:

  CUSTOMER Only:
    /dashboard/* ............... Customer dashboard
    /bookings/* ................ Booking management
    /wallet/* .................. Wallet management
    /ride-history/* ............ Ride history
    /payment/success ........... Payment success page
    /payment/failed ............ Payment failed page

  RIDER Only:
    /rider-dashboard/* ......... Rider dashboard
    /rides/* ................... Ride management
    /earnings/* ................ Earnings tracking
    /documents/* ............... Document management
    /vehicle/* ................. Vehicle management

  ADMIN Only:
    /admin-dashboard/* ......... Admin dashboard
    /admin/* ................... Admin section
    /manage-* .................. Management pages
    /users ..................... User management

  COMMON (All Authenticated Users):
    /my-profile ................ User profile
    /change-password ........... Change password
    /settings .................. Settings

✓ Special Routes (With Custom Logic):
  /reset-password .............. Force password change
  /verify-email ................ Email verification

To Add Custom Routes:
  1. Open src/lib/authUtils.ts
  2. Update the appropriate route config (e.g., customerProtectedRoutes)
  3. Add to exact[] array for exact paths
  4. Add to pattern[] array for regex patterns
  5. Middleware will automatically protect new routes
`;

// ============================================
// STEP 5: COOKIE SETUP
// ============================================
export const STEP_5_COOKIES = `
Ensure your authentication endpoints set cookies correctly:

Example for login endpoint (src/app/api/auth/login/route.ts):

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  
  // Verify credentials (your logic)
  // ...
  
  // Generate tokens
  const accessToken = generateAccessToken(user); // JWT with exp claim
  const refreshToken = generateRefreshToken(user);
  
  const response = NextResponse.json({
    success: true,
    user: user,
  });
  
  // Set cookies (HTTP-only, Secure, SameSite)
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  return response;
}

Important:
✓ Use HTTP-only cookies (not localStorage)
✓ Set HttpOnly flag to prevent XSS
✓ Set Secure flag in production
✓ Set SameSite to prevent CSRF
✓ Include 'exp' claim in JWT token
`;

// ============================================
// STEP 6: TOKEN STRUCTURE
// ============================================
export const STEP_6_TOKEN_FORMAT = `
Access Token Payload Requirements:

{
  "id": "user-123",              // User ID (or 'sub' field)
  "email": "user@example.com",   // User email
  "role": "CUSTOMER",            // User role (SUPER_ADMIN, ADMIN, RIDER, CUSTOMER)
  "name": "John Doe",            // User name (optional)
  "emailVerified": true,         // Email verification status
  "needPasswordChange": false,   // Force password reset flag
  "iat": 1234567890,             // Issued at (auto from JWT)
  "exp": 1234571490              // REQUIRED: Expiry time
}

Important:
✓ Must include 'exp' claim for expiry checking
✓ Must include 'role' with valid UserRole type
✓ 'emailVerified' and 'needPasswordChange' are optional (default to false)
✓ Generate tokens carefully on backend
`;

// ============================================
// STEP 7: TEST LOGIN FLOW
// ============================================
export const STEP_7_TEST_LOGIN = `
Manual Testing Checklist:

1. Login Page:
   [ ] Navigate to /login
   [ ] Page loads correctly
   [ ] Form displays

2. Submit Login:
   [ ] Enter valid credentials
   [ ] Submit form
   [ ] Check Network tab -> Cookies set
   [ ] accessToken cookie exists
   [ ] refreshToken cookie exists

3. Redirect:
   [ ] After login, redirected to correct dashboard
   [ ] URL is correct for role
   [ ] Page loads without errors

4. Verify Middleware:
   [ ] Open browser DevTools
   [ ] Check "Application" tab
   [ ] Expand "Cookies"
   [ ] Verify accessToken has 'HttpOnly' flag
   [ ] Verify refreshToken has 'HttpOnly' flag

5. Try Accessing Auth Routes:
   [ ] Navigate to /login while logged in
   [ ] Should redirect to dashboard
   [ ] Navigate to /register
   [ ] Should redirect to dashboard

6. Try Accessing Protected Routes:
   [ ] Navigate to /dashboard (CUSTOMER)
   [ ] Should load successfully
   [ ] Try /admin-dashboard (CUSTOMER)
   [ ] Should redirect to /dashboard

7. Logout Test:
   [ ] Navigate to logout endpoint
   [ ] Cookies should be cleared
   [ ] Should redirect to /login
   [ ] Try accessing /dashboard
   [ ] Should redirect to /login
`;

// ============================================
// STEP 8: TEST EDGE CASES
// ============================================
export const STEP_8_TEST_EDGE_CASES = `
Test All Edge Cases:

1. Force Password Reset:
   [ ] Login with account needing password change
   [ ] Try accessing /dashboard
   [ ] Check redirected to /reset-password
   [ ] Try different routes
   [ ] All should redirect to /reset-password
   [ ] Submit new password
   [ ] Check redirected to dashboard

2. Email Verification:
   [ ] Login with unverified email
   [ ] Check can access /verify-email
   [ ] Submit verification code
   [ ] Check redirected to dashboard
   [ ] Try accessing /verify-email again
   [ ] Check redirected to dashboard

3. Token Expiry:
   [ ] Manually set token exp to current time
   [ ] Make a request to protected route
   [ ] Check redirected to /login
   [ ] Check redirect parameter in URL
   [ ] Verify original URL preserved

4. Invalid Token:
   [ ] Manually modify token in cookie
   [ ] Make a request
   [ ] Check redirected to /login
   [ ] Check error logged

5. No Authentication:
   [ ] Clear all cookies
   [ ] Try accessing /dashboard
   [ ] Check redirected to /login
   [ ] Check redirect parameter preserved

6. Role Mismatches:
   [ ] Login as CUSTOMER
   [ ] Try /admin-dashboard
   [ ] Check redirected to /dashboard
   [ ] Try /rider-dashboard
   [ ] Check redirected to /dashboard
   [ ] Login as RIDER
   [ ] Try /admin-dashboard
   [ ] Check redirected to /rider-dashboard

7. Static Files:
   [ ] Load page with images/CSS
   [ ] Check Network tab
   [ ] Verify no unnecessary redirects
   [ ] Check assets load correctly

8. Common Routes:
   [ ] Login as CUSTOMER
   [ ] Access /my-profile
   [ ] Should load successfully
   [ ] Login as RIDER
   [ ] Access /my-profile
   [ ] Should load successfully
   [ ] Login as ADMIN
   [ ] Access /my-profile
   [ ] Should load successfully
`;

// ============================================
// STEP 9: COMMON ISSUES & SOLUTIONS
// ============================================
export const STEP_9_TROUBLESHOOTING = `
Issue: Middleware not running

Solution:
  1. Check middleware.ts is in src/ folder (not src/app/)
  2. Verify file is named exactly 'middleware.ts'
  3. Check next.config.ts doesn't disable middleware
  4. Restart dev server
  5. Clear .next folder and rebuild


Issue: Getting stuck on login page

Solution:
  1. Check JWT_SECRET matches backend
  2. Verify token includes 'exp' claim
  3. Check token verification in browser console
  4. Verify role matches UserRole type
  5. Check cookies are set in browser


Issue: Redirecting infinitely

Solution:
  1. Check redirect URL is valid
  2. Check route pattern matching
  3. Verify role is correct in token
  4. Check for typos in route paths
  5. Add logs to middleware for debugging


Issue: Static files not loading

Solution:
  1. Check matchers exclude static files
  2. Verify asset paths in HTML
  3. Check Content-Type headers
  4. Clear browser cache
  5. Rebuild project


Issue: Always redirecting to login

Solution:
  1. Verify token is in cookies
  2. Check token verification passes
  3. Verify secret matches backend
  4. Check token hasn't expired
  5. Check role is set in token payload


Issue: Permission errors on API routes

Solution:
  1. Verify token is sent in Authorization header
  2. Check requireRole() or hasPermission() calls
  3. Verify role has required permission
  4. Check error message in console
  5. Add logging to debug
`;

// ============================================
// STEP 10: DEPLOYMENT CHECKLIST
// ============================================
export const STEP_10_DEPLOYMENT = `
Pre-Deployment Checklist:

Environment Variables:
  [ ] NEXT_PUBLIC_JWT_SECRET set in production
  [ ] All env vars added to deployment platform
  [ ] Secrets are strong and unique
  [ ] No hardcoded secrets in code

Security:
  [ ] JWT verification working
  [ ] Cookies have Secure flag in production
  [ ] CORS properly configured
  [ ] CSRF protection enabled
  [ ] Rate limiting implemented
  [ ] Input validation active

Testing:
  [ ] All user flows tested
  [ ] All roles tested
  [ ] Edge cases verified
  [ ] Error handling checked
  [ ] Performance acceptable

Documentation:
  [ ] Updated README with auth info
  [ ] Added API documentation
  [ ] Team knows how to use system
  [ ] Troubleshooting guide available

Performance:
  [ ] Middleware performance acceptable
  [ ] No N+1 queries
  [ ] Token validation fast
  [ ] Database queries optimized

Monitoring:
  [ ] Error logging configured
  [ ] Auth events tracked
  [ ] Performance monitoring active
  [ ] Alerts set up for failures

Rollback Plan:
  [ ] Can quickly revert changes
  [ ] Backup of working version
  [ ] Clear rollback procedure
`;

// ============================================
// STEP 11: PERFORMANCE OPTIMIZATION
// ============================================
export const STEP_11_OPTIMIZATION = `
Optimization Tips:

Middleware Performance:
  ✓ Matcher excludes unnecessary routes
  ✓ Token verification uses cached crypto
  ✓ No database calls in middleware
  ✓ Minimal route matching logic

Route Pattern Matching:
  ✓ Use exact paths when possible
  ✓ Regex patterns compiled once
  ✓ More specific patterns first
  ✓ Avoid complex regex

Token Verification:
  ✓ Verify once per request
  ✓ Cache key in memory if possible
  ✓ Use standard JWT libraries
  ✓ Validation is fast

Cookie Storage:
  ✓ Keep tokens concise
  ✓ Compress payload if needed
  ✓ Don't store unnecessary data
  ✓ Use HTTP-only for security

Database Optimization:
  ✓ Don't query database in middleware
  ✓ Cache user role in JWT
  ✓ Query in API routes, not middleware
  ✓ Use indexes on user lookup

Caching Strategy:
  ✓ Cache role hierarchy
  ✓ Cache route config
  ✓ Cache regex patterns
  ✓ Don't cache per-request data
`;

// ============================================
// STEP 12: FINAL VERIFICATION
// ============================================
export const STEP_12_FINAL_CHECK = `
Final Verification Checklist:

Code Quality:
  [ ] No console.log in production code
  [ ] No hardcoded secrets
  [ ] Error handling complete
  [ ] TypeScript strict mode passes
  [ ] ESLint passes

Functionality:
  [ ] Login works
  [ ] Logout works
  [ ] Password reset works
  [ ] Email verification works
  [ ] Role-based access works
  [ ] All edge cases handled

API Routes:
  [ ] Protected routes secured
  [ ] Public routes accessible
  [ ] Error responses consistent
  [ ] Rate limiting working
  [ ] CORS headers correct

Browser Compatibility:
  [ ] Cookies work across browsers
  [ ] Redirects work correctly
  [ ] No JavaScript errors
  [ ] Mobile responsive
  [ ] Session persistence works

Database:
  [ ] User creation works
  [ ] Role assignment works
  [ ] Tokens generate correctly
  [ ] Tokens verify correctly
  [ ] Logout clears session

Documentation:
  [ ] README updated
  [ ] Code comments clear
  [ ] Error handling documented
  [ ] Edge cases documented
  [ ] Team trained on system

Ready to Deploy:
  [ ] All checks passed
  [ ] No known issues
  [ ] Tested in production environment
  [ ] Rollback plan ready
  [ ] Team notified

After Deployment:
  [ ] Monitor error logs
  [ ] Check performance metrics
  [ ] User feedback collected
  [ ] Verify all features work
  [ ] Update documentation as needed
`;

export const allSteps = [
  STEP_1_CHECK_FILES,
  STEP_2_ENV_VARS,
  STEP_3_NEXT_CONFIG,
  STEP_4_ROUTES,
  STEP_5_COOKIES,
  STEP_6_TOKEN_FORMAT,
  STEP_7_TEST_LOGIN,
  STEP_8_TEST_EDGE_CASES,
  STEP_9_TROUBLESHOOTING,
  STEP_10_DEPLOYMENT,
  STEP_11_OPTIMIZATION,
  STEP_12_FINAL_CHECK,
];

export default allSteps;
