import React, { useState } from 'react';

const LoginGateway = ({ onSubmit }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    password: '',
    favouriteMood: 'Sad / Emotional',
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        firstName: form.firstName || 'Listener',
        email: form.email,
        tier: 'Complimentary Member',
        preference: form.favouriteMood,
      });
      setSubmitting(false);
    }, 500);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Panel - Login/Signup Form */}
        <div className="auth-form-panel">
          <div className="auth-logo">
            <div className="logo-icon">♪</div>
            <span>Gramophone</span>
          </div>

          <div className="auth-content">
            <h1>{isSignUp ? 'Create Account' : 'Login to Your Account'}</h1>
            <p className="auth-subtitle">Login using social networks</p>

            {/* Minimal icon-only social row */}
            <div className="social-auth icon-only" role="group" aria-label="Social sign in">
              {/* Google */}
              <button
                type="button"
                className="social-button brand-google"
                onClick={() => handleSocialLogin('Google')}
                aria-label="Continue with Google"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M21.6 12.237c0-.68-.06-1.34-.175-1.976H12v3.743h5.54c-.238 1.287-.96 2.377-2.05 3.107v2.58h3.31c1.938-1.784 3.04-4.412 3.04-7.454z"/>
                  <path fill="currentColor" d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.31-2.58c-.92.62-2.1.98-3.32.98-2.55 0-4.71-1.72-5.48-4.03H3.17v2.54C4.83 19.8 8.14 22 12 22z"/>
                  <path fill="currentColor" d="M6.52 13. - not used" opacity="0"/>
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                className="social-button brand-facebook"
                onClick={() => handleSocialLogin('Facebook')}
                aria-label="Continue with Facebook"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              {/* Instagram */}
              <button
                type="button"
                className="social-button brand-instagram"
                onClick={() => handleSocialLogin('Instagram')}
                aria-label="Continue with Instagram"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.3A4.7 4.7 0 1 0 16.7 13 4.7 4.7 0 0 0 12 8.3zm5.2-2.7a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1z"/>
                </svg>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                className="social-button brand-twitter"
                onClick={() => handleSocialLogin('Twitter')}
                aria-label="Continue with Twitter"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 0 0 1.88-2.36 8.48 8.48 0 0 1-2.7 1.03 4.22 4.22 0 0 0-7.18 3.85 12 12 0 0 1-8.7-4.41 4.22 4.22 0 0 0 1.31 5.63 4.2 4.2 0 0 1-1.91-.53v.05a4.23 4.23 0 0 0 3.38 4.14 4.28 4.28 0 0 1-1.9.07 4.23 4.23 0 0 0 3.95 2.94A8.48 8.48 0 0 1 2 19.54 12 12 0 0 0 8.29 21c7.55 0 11.68-6.25 11.68-11.66 0-.18 0-.35-.01-.53A8.36 8.36 0 0 0 22.46 6z"/>
                </svg>
              </button>

              {/* Spotify */}
              <button
                type="button"
                className="social-button brand-spotify"
                onClick={() => handleSocialLogin('Spotify')}
                aria-label="Continue with Spotify"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zM18 13.98c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.42.24z"/>
                </svg>
              </button>

              {/* Apple */}
              <button
                type="button"
                className="social-button brand-apple"
                onClick={() => handleSocialLogin('Apple Music')}
                aria-label="Continue with Apple"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
            </div>

            <div className="divider-line">
              <span>OR</span>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="input-group">
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={updateField('firstName')}
                    placeholder="Name"
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="input-group password-group">
                <input
                  type="password"
                  value={form.password}
                  onChange={updateField('password')}
                  placeholder="Password"
                  required
                  minLength={6}
                />
                <button type="button" className="password-toggle" aria-label="Toggle password visibility">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>

              {isSignUp && (
                <div className="input-group">
                  <select value={form.favouriteMood} onChange={updateField('favouriteMood')}>
                    <option value="" disabled>Preferred Mood</option>
                    <option>Sad / Emotional</option>
                    <option>Broken</option>
                    <option>Happy</option>
                    <option>Feel-good Vibe</option>
                    <option>Upbeat Dance</option>
                  </select>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel - Promo */}
        <div className="auth-promo-panel">
          <button type="button" className="close-btn" onClick={() => {}}>×</button>
          
          <div className="promo-content">
            <h2>{isSignUp ? 'Welcome Back!' : 'New Here?'}</h2>
            <p>
              {isSignUp 
                ? 'Already have an account? Sign in and continue your music journey!'
                : 'Sign up and discover a great amount of new opportunities!'}
            </p>
            <button type="button" className="switch-btn" onClick={toggleMode}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {/* Decorative circles */}
          <div className="deco-circle circle-1"></div>
          <div className="deco-circle circle-2"></div>
          <div className="deco-triangle"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginGateway;

