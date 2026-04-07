/**
 * Central Authentication Configuration
 * Hardened for Production (Render) Cross-Site Cookie Compatibility.
 */

const SESSION_DAYS = 7;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

const AUTH_CONFIG = {
  COOKIE_MAX_AGE: SESSION_MS,
  JWT_EXPIRES_IN: `${SESSION_DAYS}d`,
  COOKIE_NAME: 'auth_token',

  /**
   * Generates production-ready cookie options.
   * CRITICAL: Render frontend and backend are on different subdomains.
   * Modern browsers REJECT cross-site cookies unless SameSite=None and Secure=True.
   */
  getCookieOptions: () => {
    // Detect if on Render or standard Production
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
    
    return {
      httpOnly: true,
      secure: isProduction, // MUST be true for sameSite: 'none'
      sameSite: isProduction ? 'none' : 'lax', // 'none' enables cross-site cookies on Render
      maxAge: SESSION_MS,
      path: '/',
      // partitioned: true, // Only enable if SameSite: None still fails in Chrome
    };
  },

  getClearCookieOptions: () => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
    
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };
  }
};

module.exports = AUTH_CONFIG;
