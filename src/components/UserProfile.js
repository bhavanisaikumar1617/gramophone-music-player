import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

const UserProfile = memo(({ user, onLogout }) => {
  const initials = user?.firstName?.slice(0, 2).toUpperCase() || 'GM';

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="focus-ring group flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] py-1.5 pl-1.5 pr-4 transition hover:border-gramophone-accent/30 hover:bg-white/[0.06]"
        aria-label="User profile"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gramophone-accent-secondary to-gramophone-accent text-xs font-bold text-white shadow-glow-sm transition-transform duration-200 group-hover:scale-105">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold text-gramophone-text">
            {user?.firstName || 'Gramophone Guest'}
          </span>
          <span className="block text-xs text-gramophone-muted">{user?.tier || 'Solo Studio'}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={onLogout}
        className="focus-ring rounded-full p-2.5 text-gramophone-muted transition hover:bg-white/[0.06] hover:text-gramophone-text"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
});

UserProfile.displayName = 'UserProfile';

export default UserProfile;
