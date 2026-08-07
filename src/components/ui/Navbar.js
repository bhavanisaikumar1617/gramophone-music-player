import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Compass,
  Disc3,
  Home,
  Library,
  ListMusic,
  Moon,
  Radio,
  Search,
  Sparkles,
  Sun,
} from 'lucide-react';
import PremiumButton from './PremiumButton';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, target: 'hero' },
  { id: 'discover', label: 'Discover', icon: Compass, target: 'trending' },
  { id: 'library', label: 'Library', icon: Library, target: 'player' },
  { id: 'playlists', label: 'Playlists', icon: ListMusic, target: 'playlists' },
  { id: 'radio', label: 'Radio', icon: Radio, target: 'rooms' },
];

const Navbar = memo(
  ({
    theme,
    onToggleTheme,
    activeNav,
    onNavClick,
    onSearchFocus,
    user,
    onLogin,
    onSignup,
    profileSlot,
  }) => (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-gramophone-bg/72 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.04),0_12px_40px_rgba(0,0,0,0.22)]"
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <button
            type="button"
            onClick={() => onNavClick('home')}
            className="focus-ring group flex items-center gap-3 rounded-[18px] px-2 py-1 transition hover:bg-white/[0.04]"
            aria-label="Gramophone home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-gradient-to-br from-gramophone-accent-secondary to-gramophone-accent shadow-glow-sm transition-transform duration-200 group-hover:scale-105">
              <Disc3 className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-gramophone-accent">
                Gramophone
              </p>
              <p className="text-sm font-semibold text-gramophone-text">Private Listening</p>
            </div>
          </button>

          <nav className="hidden items-center gap-2 xl:flex" aria-label="Main navigation">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavClick(id)}
                className={`focus-ring relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.04] ${
                  activeNav === id
                    ? 'bg-white/[0.06] text-gramophone-text shadow-[0_10px_24px_rgba(0,0,0,0.18)]'
                    : 'text-gramophone-text-secondary hover:text-gramophone-text'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                {activeNav === id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-gramophone-accent-secondary to-gramophone-accent shadow-glow-sm"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onSearchFocus}
            className="focus-ring hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-gramophone-muted transition hover:border-gramophone-accent/30 hover:bg-white/[0.06] hover:text-gramophone-text-secondary md:flex"
            aria-label="Focus search"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
            <kbd className="ml-1 hidden rounded border border-white/[0.08] px-1.5 py-0.5 text-[0.65rem] text-gramophone-muted lg:inline">Ctrl K</kbd>
          </button>

          <button
            type="button"
            className="focus-ring relative rounded-full p-2.5 text-gramophone-text-secondary transition hover:bg-white/[0.06] hover:text-gramophone-text"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gramophone-accent shadow-glow" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="focus-ring rounded-full p-2.5 text-gramophone-text-secondary transition hover:bg-white/[0.06] hover:text-gramophone-text"
            aria-label="Toggle light and dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {!user && (
            <PremiumButton variant="premium" size="sm" icon={Sparkles} onClick={onSignup}>
              Premium
            </PremiumButton>
          )}

          {user ? (
            profileSlot
          ) : (
            <div className="flex items-center gap-2">
              <PremiumButton variant="ghost" size="sm" onClick={onLogin}>
                Log in
              </PremiumButton>
              <PremiumButton variant="primary" size="sm" onClick={onSignup} className="hidden sm:inline-flex">
                Sign up
              </PremiumButton>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
);

Navbar.displayName = 'Navbar';

export default Navbar;
