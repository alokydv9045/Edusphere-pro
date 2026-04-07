/**
 * Central Authentication Configuration
 * Deeply built to handle Production (Render) and Development environments.
 */

const SESSION_DAYS = 7;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

const AUTH_CONFIG = {
  // Duration in milliseconds (for Cookies)
  COOKIE_MAX_AGE: SESSION_MS,
  
  // Duration as string (for JWT)
  JWT_EXPIRES_IN: `${SESSION_DAYS}d`,
  
  // Cookie identifier
  COOKIE_NAME: 'auth_token',

  /**
   * Generates production-ready cookie options.
   * Ensures 'Secure' and 'SameSite: None' is applied on Render.
   */
  getCookieOptions: () => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      httpOnly: true,
      secure: isProduction, // HTTPS required in prod
      sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-domain on Render
      maxAge: SESSION_MS,
      path: '/',
    };
  },

  /**
   * Cookie options specifically for clearing/logout.
   */
  getClearCookieOptions: () => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };
  }
};

module.exports = AUTH_CONFIG;
