import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import MusicPlayer from './components/MusicPlayer';
import UserProfile from './components/UserProfile';
import AuthModal from './components/AuthModal';
import Navbar from './components/ui/Navbar';
import Discover from './pages/Discover';
import LibraryPage from './pages/Library';
import PlaylistsPage from './pages/Playlists';
import RadioPage from './pages/Radio';
import './App.css';

const navTargets = {
  home: 'hero',
  discover: 'trending',
  library: 'player',
  playlists: 'playlists',
  radio: 'rooms',
};

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [authMode, setAuthMode] = useState(null);
  const [activeNav, setActiveNav] = useState(() => {
    const path = window.location.pathname.replace(/^\/+/, '') || '';
    if (path === '' || path === 'home') return 'home';
    if (path === 'discover') return 'discover';
    if (path === 'library') return 'library';
    if (path === 'playlists') return 'playlists';
    if (path === 'radio') return 'radio';
    return 'home';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleAuthSuccess = (payload) => {
    setUser({
      ...payload,
      memberSince: payload.memberSince || 'Dec 2021',
      city: payload.city || 'Hyderabad',
      sessions: payload.sessions || 128,
    });
    setAuthMode(null);
  };

  const handleLogout = () => setUser(null);
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleNavClick = useCallback((navId) => {
    setActiveNav(navId);
    // update the URL so routes are bookmarkable
    const url = navId === 'home' ? '/' : `/${navId}`;
    try {
      window.history.pushState({ nav: navId }, '', url);
    } catch (e) {
      // ignore
    }
    const targetId = navTargets[navId];
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname.replace(/^\/+/, '') || '';
      if (path === '' || path === 'home') setActiveNav('home');
      else if (path === 'discover') setActiveNav('discover');
      else if (path === 'library') setActiveNav('library');
      else if (path === 'playlists') setActiveNav('playlists');
      else if (path === 'radio') setActiveNav('radio');
      else setActiveNav('home');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleSearchFocus = useCallback(() => setIsSearchOpen(true), []);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(169,112,255,0.18),transparent_65%)] opacity-80" />
      <div className="absolute left-0 rounded-full pointer-events-none top-24 h-80 w-80 bg-gramophone-accent/10 blur-3xl" />
      <div className="absolute right-0 rounded-full pointer-events-none top-40 h-96 w-96 bg-gramophone-accent-secondary/10 blur-3xl" />

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onSearchFocus={handleSearchFocus}
        user={user}
        onLogin={() => setAuthMode('login')}
        onSignup={() => setAuthMode('signup')}
        profileSlot={<UserProfile user={user} onLogout={handleLogout} />}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 px-4 py-6 mx-auto max-w-content sm:px-6 lg:px-8 lg:py-8"
      >
        {activeNav === 'home' && (
          <MusicPlayer
            user={user}
            activeNav={activeNav}
            searchInputRef={searchInputRef}
            isSearchOpen={isSearchOpen}
            onCloseSearch={() => setIsSearchOpen(false)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}
        {activeNav === 'discover' && <Discover />}
        {activeNav === 'library' && <LibraryPage />}
        {activeNav === 'playlists' && <PlaylistsPage />}
        {activeNav === 'radio' && <RadioPage />}
      </motion.main>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSubmit={handleAuthSuccess}
          defaultMood="Feel-good Vibe"
        />
      )}
    </div>
  );
}

export default App;
