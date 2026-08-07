import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

const SearchBar = memo(
  ({
    searchQuery,
    setSearchQuery,
    onSearch,
    placeholder = 'Search by song, artist, or mood',
    inputRef,
    onOpenOverlay,
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = (event) => {
      setSearchQuery(event.target.value);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      setIsFocused(false);
      onSearch();
    };

    const isDisabled = !searchQuery.trim();

    return (
      <div className="relative" id="search">
        <form onSubmit={handleSubmit} className="relative">
          <motion.div
            animate={{
              boxShadow: isFocused
                ? '0 0 0 2px rgba(169,112,255,0.35), 0 8px 32px rgba(0,0,0,0.3)'
                : '0 0 0 1px rgba(255,255,255,0.08)',
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-[22px] border border-white/[0.08] bg-gramophone-card/80 px-5 py-3.5 shadow-card backdrop-blur-glass"
          >
            <button type="button" onClick={() => onOpenOverlay?.()} className="rounded-full p-1 focus-ring">
              <Search
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isFocused ? 'text-gramophone-accent' : 'text-gramophone-muted'
                }`}
                aria-hidden="true"
              />
            </button>
            <label className="sr-only" htmlFor="library-search">
              Search catalogue
            </label>
            <input
              ref={inputRef}
              id="library-search"
              type="search"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              autoComplete="off"
              className="focus-ring min-w-0 flex-1 bg-transparent text-body text-gramophone-text placeholder:text-gramophone-muted"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="focus-ring rounded-full p-1 text-gramophone-muted hover:text-gramophone-text"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <motion.button
              type="submit"
              disabled={isDisabled}
              whileTap={{ scale: 0.97 }}
              className="focus-ring shrink-0 rounded-full bg-gradient-to-r from-gramophone-accent-secondary to-gramophone-accent px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Explore
            </motion.button>
          </motion.div>
        </form>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
