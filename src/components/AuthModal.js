import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';

const moodOptions = ['Sad / Emotional', 'Broken', 'Happy', 'Feel-good Vibe', 'Upbeat Dance'];
const socialProviders = [
  { id: 'google', label: 'Continue with Google', icon: 'G' },
  { id: 'facebook', label: 'Continue with Facebook', icon: 'f' },
  { id: 'instagram', label: 'Continue with Instagram', icon: 'IG' },
  { id: 'twitter', label: 'Continue with Twitter (X)', icon: 'X' },
];

const AuthModal = ({ mode = 'login', onClose, onSubmit, defaultMood = 'Sad / Emotional' }) => {
  const isSignup = mode === 'signup';
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    password: '',
    favouriteMood: defaultMood,
  });

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        firstName: form.firstName || 'Listener',
        email: form.email,
        tier: isSignup ? 'Complimentary Member' : 'Returning Listener',
        preference: form.favouriteMood,
      });
      setSubmitting(false);
    }, 600);
  };

  const handleSocialAuth = (provider) => {
    if (isSubmitting) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        firstName:
          provider === 'google'
            ? 'Google guest'
            : provider === 'facebook'
            ? 'Facebook guest'
            : provider === 'instagram'
            ? 'Instagram guest'
            : 'Twitter guest',
        email: `${provider}@gramophone.club`,
        tier: 'Social Access',
        sessions: 64,
        preference: defaultMood,
      });
      setSubmitting(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-panel relative max-h-[90vh] w-full max-w-lg overflow-y-auto p-8 md:p-10"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="focus-ring absolute right-5 top-5 rounded-full p-2 text-gramophone-muted transition hover:bg-white/[0.06] hover:text-gramophone-text"
            aria-label="Close auth modal"
          >
            <X className="h-5 w-5" />
          </button>

          <p className="mb-2 text-caption font-semibold uppercase tracking-[0.14em] text-gramophone-accent">
            {isSignup ? 'Join Gramophone' : 'Welcome back'}
          </p>
          <h2 id="auth-modal-title" className="mb-3 text-section-title text-gramophone-text">
            {isSignup ? 'Create your lounge pass' : 'Enter your listening lounge'}
          </h2>
          <p className="mb-6 text-body text-gramophone-text-secondary">
            Log in or sign up to sync favourites, pin playlists, and unlock night mode scenes across
            all your desks. Join via socials or email.
          </p>

          <div className="mb-6 space-y-2">
            {socialProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleSocialAuth(provider.id)}
                disabled={isSubmitting}
                className="focus-ring flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-gramophone-text transition hover:border-white/[0.15] hover:bg-white/[0.06] disabled:opacity-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-xs font-bold">
                  {provider.icon}
                </span>
                {provider.label}
              </button>
            ))}
          </div>

          <div className="relative mb-6 flex items-center">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="px-4 text-caption text-gramophone-muted">or continue with email</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { key: 'firstName', label: 'First name', type: 'text', placeholder: 'Ananya' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@gramophone.club' },
              {
                key: 'password',
                label: 'Passphrase',
                type: 'password',
                placeholder: 'Create something memorable',
                minLength: 6,
              },
            ].map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-caption font-medium text-gramophone-text-secondary">
                  {field.label}
                </span>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={updateField(field.key)}
                  placeholder={field.placeholder}
                  required
                  minLength={field.minLength}
                  className="focus-ring w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-body text-gramophone-text placeholder:text-gramophone-muted transition focus:border-gramophone-accent/40"
                />
              </label>
            ))}
            {isSignup && (
              <label className="block">
                <span className="mb-1.5 block text-caption font-medium text-gramophone-text-secondary">
                  Preferred listening mood
                </span>
                <select
                  value={form.favouriteMood}
                  onChange={updateField('favouriteMood')}
                  className="focus-ring w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-body text-gramophone-text transition focus:border-gramophone-accent/40"
                >
                  {moodOptions.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <PremiumButton
              type="submit"
              variant="primary"
              size="lg"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Tuning your desk...'
                : isSignup
                ? 'Create complimentary pass'
                : 'Log in'}
            </PremiumButton>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
