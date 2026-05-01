# 401 Unauthorized Error - Troubleshooting Guide

## Issue
Getting `Request failed: 401` error when accessing the Admin Dashboard at `/admin-dashboard`

## Root Causes & Solutions

### 1. **Session/Token Expired**
**Symptom**: Logged out or session timed out  
**Solution**:
- Log out and log back in
- Check browser DevTools → Application → Cookies for auth tokens
- Should see: `accessToken`, `refreshToken`, `auth.session_token`

**Check cookies**:
```javascript
// In browser console:
document.cookie  // Should show auth cookies
```

### 2. **Not Actually Logged In**
**Symptom**: Accessing dashboard without login  
**Solution**:
- Navigate to `/login` first
- Complete login flow
- Alternatively, click "Go to Login" button in error message

### 3. **Backend API Not Responding**
**Symptom**: 401 error when backend auth service is down  
**Solution**:
- Check backend API status
- Verify `BACKEND_BASE_URL` in `.env.local`
- Ensure backend is running on correct port

### 4. **Cookie Policy Issues**
**Symptom**: Cookies not being sent in requests  
**Solution**:
- Check that `BACKEND_BASE_URL` matches exactly (protocol, domain, port)
- Verify Same-Site cookie policy
- If backend is different domain, ensure CORS is configured with credentials

### 5. **Authorization Header Not Sent**
**Symptom**: Server side rendering doesn't have cookies  
**Solution**:
- The upgraded `serverFetch.ts` now handles multiple auth methods:
  - Sends Cookie header with all cookies
  - Sends Authorization header with access token (if available)
  - Extracts both `auth.session_token` and `better-auth.session_token`

---

## Debug Steps

### Step 1: Check Environment
```bash
# Verify .env.local has correct backend URL
cat .env.local | grep BACKEND_BASE_URL
```

### Step 2: Check Browser Cookies
```javascript
// In DevTools Console:
// Should see auth cookies
document.cookie

// Or in Application tab → Cookies → check all cookies
```

### Step 3: Test Login Flow
1. Clear all cookies: DevTools → Application → Clear all
2. Go to `/login`
3. Enter valid credentials
4. Wait for redirect
5. Check if cookies are created
6. Try accessing `/admin-dashboard`

### Step 4: Check Network Requests
1. Open DevTools → Network tab
2. Go to `/admin-dashboard`
3. Look for request to `/api/v1/analytics/dashboard`
4. Check:
   - Response status code
   - Request headers (should include Cookie or Authorization)
   - Response body (error message)

### Step 5: Check Server Console
```
# Look for debug output like:
[2026-05-01T12:00:00.000Z] Auth Error (401): {
  endpoint: '/analytics/dashboard',
  hasAccessToken: false,
  hasSessionToken: false,
  hasCookie: false
}
```

---

## What the Improved serverFetch Does

### Enhanced Error Handling:
```typescript
// Now checks for:
1. Access token from cookies
2. Session token (both formats)
3. Full cookie header
4. 401 errors specifically

// Returns detailed error message:
- "Your session has expired or you are not authorized..."
- Provides "Go to Login" button
- Shows actual error from API
```

### Debug Logging:
```typescript
// For 401 errors, logs:
if (response.status === 401) {
  console.warn({
    endpoint,
    hasAccessToken: !!accessToken,
    hasSessionToken: !!sessionToken,
    hasCookie: !!cookieHeader,
  });
}
```

---

## User Journey Fix

### Before:
```
User clicks → Error "Request failed: 401" → Confused ❌
```

### After:
```
User clicks → Error "Session expired. Please log in again" → "Go to Login" button ✓
```

---

## Files Modified

### 1. `src/lib/serverFetch.ts` - Enhanced Error Handling
- Better error messages from API
- Explicit token/session extraction
- 401 debug logging
- Timeout error handling

### 2. `src/app/(dashboard)/admin-dashboard/page.tsx` - Better UX
- Detects 401 errors specifically
- Shows appropriate message
- Provides login button
- Shows "Go to Login" option

### 3. `src/app/(dashboard)/admin-dashboard/analytics/page.tsx` - Better UX
- Same improvements as above
- For analytics page

---

## Prevention

### Best Practices:
1. ✅ Always test auth flow before deploying
2. ✅ Check `.env.local` variables
3. ✅ Verify backend API is running
4. ✅ Test with fresh cookies (private window)
5. ✅ Check API response in DevTools Network tab

### Development Tips:
```bash
# Test API directly with curl/postman before debugging frontend
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:BACKEND_PORT/api/v1/analytics/dashboard

# If this returns 401, problem is backend auth
# If frontend returns 401, problem might be token not being sent
```

---

## Next Steps if Issue Persists

1. Check backend auth middleware
2. Verify token is being saved to cookies
3. Test API with Postman/curl directly
4. Check if backend requires specific header format
5. Verify user has ADMIN or SUPER_ADMIN role
