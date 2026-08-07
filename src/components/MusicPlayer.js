/* eslint-disable */
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from 'framer-motion';
import { Play, Heart } from 'lucide-react';
import LanguageFilter from "./LanguageFilter";
import AlbumCard from "./ui/AlbumCard";
import PremiumButton from "./ui/PremiumButton";
import { findReleaseArtwork, searchSongs, getsongs, searchOnlineSongs } from "../api";
import { getTrackArtwork, getBestArtwork } from '../utils/imageService';
import SearchOverlay from './ui/SearchOverlay';
import PremiumPlayer from './ui/PremiumPlayer';
import MiniPlayer from './ui/MiniPlayer';
import QueuePanel from './ui/QueuePanel';
// Page components live in src/pages/ and are kept separate from the player.

// Vite serves files from `public/` at the project root, so use root-relative paths
const asset = (relativePath) => `${relativePath}`;

const curatedCollection = [
  {
    id: "evare",
    title: "Evare",
    artist: "Vijay Yesudas",
    mood: "Dreamy synthwave",
    duration: "4:34",
    albumArt: getTrackArtwork({ title: 'Evare', artist: 'Vijay Yesudas', language: 'telugu', seed: 'evare' }),
    url: asset("/audio/Evare.mp3"),
    language: "telugu",
  },
  {
    id: "vennello-hai-hai",
    title: "Vennello Hai Hai",
    artist: "Hariharan",
    mood: "Late-night acoustic",
    duration: "4:02",
    albumArt: getTrackArtwork({ title: 'Vennello Hai Hai', artist: 'Hariharan', language: 'telugu', seed: 'vennello-hai-hai' }),
    url: asset("/audio/VennelloHaiHai.mp3"),
    language: "telugu",
  },
  {
    id: "yemaindho",
    title: "Yemaindho",
    artist: "Karthik",
    mood: "Feel-good pop",
    duration: "3:58",
    albumArt: getTrackArtwork({ title: 'Yemaindho', artist: 'Karthik', language: 'telugu', seed: 'yemaindho' }),
    url: asset("/audio/Yemaindho.mp3"),
    language: "telugu",
  },
  {
    id: "soundhelix-01",
    title: "Neon Skyline",
    artist: "SoundHelix Ensemble",
    mood: "Instrumental night drive",
    duration: "6:12",
    albumArt: getTrackArtwork({ title: 'Neon Skyline', artist: 'SoundHelix Ensemble', language: 'instrumental', seed: 'soundhelix-01' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    language: "instrumental",
  },
  {
    id: "soundhelix-02",
    title: "Monsoon Poise",
    artist: "SoundHelix Ensemble",
    mood: "Cinematic strings",
    duration: "5:21",
    albumArt: getTrackArtwork({ title: 'Monsoon Poise', artist: 'SoundHelix Ensemble', language: 'instrumental', seed: 'soundhelix-02' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    language: "instrumental",
  },
  {
    id: "no-good-deed",
    title: "No Good Deed",
    artist: "Ariana Grande & Cynthia Erivo",
    mood: "Broadway pop",
    duration: "3:45",
    albumArt: getTrackArtwork({ title: 'No Good Deed', artist: 'Ariana Grande & Cynthia Erivo', language: 'english', seed: 'no-good-deed' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    language: "english",
  },
  {
    id: "nobodys-girl",
    title: "NOBODY'S GIRL",
    artist: "Sabrina Carpenter",
    mood: "Upbeat pop",
    duration: "2:55",
    albumArt: getTrackArtwork({ title: "NOBODY'S GIRL", artist: 'Sabrina Carpenter', language: 'english', seed: 'nobodys-girl' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    language: "english",
  },
  {
    id: "feliz-navidad",
    title: "Feliz Navidad",
    artist: "José Feliciano",
    mood: "Festive classic",
    duration: "3:02",
    albumArt: getTrackArtwork({ title: 'Feliz Navidad', artist: 'José Feliciano', language: 'spanish', seed: 'feliz-navidad' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    language: "spanish",
  },
  {
    id: "o-come-all-ye-faithful",
    title: "O Come All Ye Faithful",
    artist: "Spotify Singles Holiday",
    mood: "Holiday choral",
    duration: "3:30",
    albumArt: getTrackArtwork({ title: 'O Come All Ye Faithful', artist: 'Spotify Singles Holiday', language: 'english', seed: 'o-come-all-ye-faithful' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    language: "english",
  },
  {
    id: "chanel",
    title: "CHANEL",
    artist: "Sabrina Carpenter",
    mood: "Pop anthem",
    duration: "3:10",
    albumArt: getTrackArtwork({ title: 'CHANEL', artist: 'Sabrina Carpenter', language: 'english', seed: 'chanel' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    language: "english",
  },
  {
    id: "brighter",
    title: "Brighter",
    artist: "Benson Boone",
    mood: "Indie pop",
    duration: "3:25",
    albumArt: getTrackArtwork({ title: 'Brighter', artist: 'Benson Boone', language: 'english', seed: 'brighter' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    language: "english",
  },
  {
    id: "kesariya-lofi",
    title: "Kesariya (Lofi Flip)",
    artist: "Arijit Singh",
    mood: "Romantic ballad",
    duration: "4:05",
    albumArt: getTrackArtwork({ title: 'Kesariya (Lofi Flip)', artist: 'Arijit Singh', language: 'hindi', seed: 'kesariya-lofi' }),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    language: "hindi",
  },
];

// Local curated recommendations for regional languages with limited iTunes coverage
const localCuratedByLanguage = {
  telugu: [
    { id: 'telugu-1', title: 'Chinni Chinni Aasalu', artist: 'S.P. Balasubrahmanyam', language: 'telugu', url: asset('/audio/Evare.mp3') },
    { id: 'telugu-2', title: 'Swarna Bangaru', artist: 'Karthik', language: 'telugu', url: asset('/audio/Yemaindho.mp3') },
    { id: 'telugu-3', title: 'Vennello Melody', artist: 'Hariharan', language: 'telugu', url: asset('/audio/VennelloHaiHai.mp3') },
    { id: 'telugu-4', title: 'Raga Glow', artist: 'Anup Jalota', language: 'telugu', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'telugu-5', title: 'Midnight Raaga', artist: 'Karthik', language: 'telugu', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  ],
  tamil: [
    { id: 'tamil-1', title: 'Naan Pizhaippeno', artist: 'A. R. Rahman', language: 'tamil', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 'tamil-2', title: 'Oruvan Oruvan', artist: 'S. P. Balasubrahmanyam', language: 'tamil', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: 'tamil-3', title: 'Chinna Chinna Vannakuyil', artist: 'Hariharan', language: 'tamil', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  ],
  malayalam: [
    { id: 'mal-1', title: 'Malayalam Breeze', artist: 'KJ Yesudas', language: 'malayalam', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { id: 'mal-2', title: 'Kerala Rain', artist: 'Shankar Mahadevan', language: 'malayalam', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  ],
  kannada: [
    { id: 'kan-1', title: 'Kannada Sunrise', artist: 'Rajesh Krishnan', language: 'kannada', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { id: 'kan-2', title: 'Mysore Strings', artist: 'Raghu Dixit', language: 'kannada', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  ],
};

const normalizeSongs = (list = []) => {
  if (!Array.isArray(list) || !list.length) {
    return curatedCollection;
  }

  return list.map((song, index) => {
    const fallback = curatedCollection[index % curatedCollection.length];
    const title = song.title ?? fallback.title;
    const artist = song.artist ?? fallback.artist;
    const language = song.language ?? fallback.language ?? "english";
    const id = song.id ?? fallback.id ?? `song-${index}`;
    return {
      id,
      title,
      artist,
      mood: song.mood ?? fallback.mood,
      duration: song.duration ?? fallback.duration,
      // Do not borrow an unrelated cover from the fallback song: every missing
      // image gets its own deterministic premium cover instead.
      albumArt: song.albumArt || getTrackArtwork({ title, artist, language, seed: id }),
      url: song.url ?? fallback.url,
      description: song.description ?? fallback.description ?? "",
      language,
    };
  });
};

// Listening rooms removed — kept previously as sample data. Removed to avoid unused UI and layout gaps.

const editorialShelves = [
  {
    title: "All Night Gram Sessions",
    curator: "Curated by Ishaan",
    count: 27,
    summary: "Vinyl transfers from private soirees across Chennai & Vizag.",
  },
  {
    title: "Future Folk Futures",
    curator: "Curated by Zia",
    count: 18,
    summary: "Plucked strings & modular rigs bending time and raaga.",
  },
  {
    title: "Gramophone Originals",
    curator: "Curated by Residencies",
    count: 12,
    summary: "Live-to-tape recordings captured inside our Bangalore loft.",
  },
];

const languageOptions = [
  { label: "All", value: "all" },
  { label: "English", value: "english" },
  { label: "Telugu", value: "telugu" },
  { label: "Hindi", value: "hindi" },
  { label: "Tamil", value: "tamil" },
  { label: "Malayalam", value: "malayalam" },
  { label: "Kannada", value: "kannada" },
  { label: "Instrumental", value: "instrumental" },
  { label: "Radio", value: "radio" },
];

const trendingHighlights = [
  {
    title: "No Good Deed",
    artist: "Ariana Grande & Cynthia Erivo",
    note: "Climbing the global Trending chart.",
  },
  { title: "NOBODY'S GIRL", artist: "Sabrina Carpenter", note: "UK listeners can't get enough." },
  { title: "Feliz Navidad", artist: "José Feliciano", note: "Seasonal favourite returning early." },
  { title: "Brighter", artist: "Benson Boone", note: "Viral 50 UK spotlight." },
];

const MusicPlayer = ({ user, activeNav, searchInputRef, isSearchOpen, onCloseSearch, onOpenSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [library, setLibrary] = useState(curatedCollection);
  // masterTracks is the immutable master library of all fetched tracks.
  // UI filters (by language) derive from this; changing the UI must not
  // alter playback state, queue, or the audio source.
  const [masterTracks, setMasterTracks] = useState(curatedCollection);
  const [currentSong, setCurrentSong] = useState(curatedCollection[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const queueInitializedRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([
    { id: "evening-lounge", name: "Evening Lounge", songs: [] },
    { id: "focus-folders", name: "Focus Folders", songs: [] },
  ]);
  const [newPlaylist, setNewPlaylist] = useState("");
  const [playCounts, setPlayCounts] = useState({});
  const [queueItems, setQueueItems] = useState(curatedCollection);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Bootstrap recommendations using shared recommendation service
    const bootstrap = async () => {
      setStatus({ loading: true, error: null });
      try {
        // prefer a broad global top songs feed
        await fetchRecommendations('all');
        setStatus({ loading: false, error: null });
      } catch (err) {
        console.warn('Bootstrap recommendation failed', err);
        // fallback to local curated collection
          setLibrary(curatedCollection);
          setMasterTracks(curatedCollection);
          setCurrentSong(curatedCollection[0]);
        setStatus({ loading: false, error: 'Using offline catalogue while the live service recovers.' });
      }
    };

    bootstrap();
  }, []);

  // Helper: format millis -> mm:ss
  const formatDuration = (ms) => {
    if (!ms && ms !== 0) return ''; // unknown
    const total = Math.round(ms / 1000);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  // Transform iTunes / remote API items into our song shape
  const transformRemoteItem = (item, langHint) => {
    const id = String(item.trackId || item.collectionId || item.id || `${item.trackName || item.collectionName}-${item.artistName || ''}`);
    const title = item.trackName || item.collectionName || item.title || 'Unknown Title';
    const artist = item.artistName || item.artist || 'Unknown Artist';
    const artwork100 = item.artworkUrl100 || item.artworkUrl600 || item.artworkUrl;
    const artwork60 = item.artworkUrl60 || item.artworkUrl;
    const artwork30 = item.artworkUrl30 || item.artworkUrl;
    const albumArt = getBestArtwork(item) || getTrackArtwork({ title, artist, language: langHint, seed: id });
    const durationMs = item.trackTimeMillis || item.durationMillis || null;
    const durationStr = durationMs ? formatDuration(durationMs) : (item.duration || '0:00');
    const preview = item.previewUrl || item.preview || item.url || '';
    const language = (langHint || item.primaryGenreName || item.language || 'english').toLowerCase();
    return {
      id,
      title,
      artist,
      albumArt,
      duration: durationStr,
      url: preview || item.trackViewUrl || item.collectionViewUrl || '',
      previewUrl: preview || item.preview || '',
      language,
      // keep raw for debugging
      _raw: item,
    };
  };

  // Centralized recommendation fetcher used by all UI sections
  const fetchRecommendations = async (lang = 'all') => {
    const apiCache = (MusicPlayer.apiCache ||= {});
    const langKey = String(lang || 'all').toLowerCase();
    setStatus((s) => ({ ...s, loading: true }));

    // mapping of language -> search term
    const termMap = {
      telugu: 'Telugu Hits',
      tamil: 'Tamil Hits',
      malayalam: 'Malayalam Hits',
      kannada: 'Kannada Hits',
      hindi: 'Hindi Hits',
      english: 'Top English',
      instrumental: 'Instrumental',
      radio: 'Top Songs',
      all: 'Top Songs',
    };

    const term = termMap[langKey] || `${langKey} songs`;
    const country = ['telugu', 'hindi', 'tamil', 'kannada', 'malayalam'].includes(langKey) ? 'in' : 'gb';

    // Use cache when available
    if (apiCache[langKey]) {
      const cached = apiCache[langKey];
      setMasterTracks(cached);
      setLibrary((prev) => {
        const merged = [...cached, ...prev];
        const seen = new Set();
        return merged.filter((s) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        });
      });
      setCurrentSong((c) => c || (cached[0] || null));
      setStatus((s) => ({ ...s, loading: false }));
      return cached;
    }

    try {
      const results = await searchOnlineSongs(term, { limit: 20, country });
      const transformed = Array.isArray(results) ? results.map((r) => transformRemoteItem(r, langKey)) : [];

      // Keep API results even if small; supplement if needed
      let final = transformed.slice(0, 20);
      const MIN_TARGET = 12;
      if (final.length < MIN_TARGET) {
        const supplemental = (localCuratedByLanguage[langKey] || []).map((s, idx) => ({
          ...s,
          id: s.id || `curated-${langKey}-${idx}`,
          albumArt: s.albumArt || getTrackArtwork({ title: s.title, artist: s.artist, language: langKey, seed: s.id || `curated-${langKey}-${idx}` }),
          duration: s.duration || formatDuration(0),
          previewUrl: s.url || s.previewUrl || '',
          url: s.url || s.previewUrl || '',
          language: langKey,
        }));
        for (const s of supplemental) {
          if (!final.some((f) => f.id === s.id)) final.push(s);
          if (final.length >= MIN_TARGET) break;
        }
      }

      // If API returned zero and we have local curated, use curated as fallback
      if (!final.length) {
        const fallback = (localCuratedByLanguage[langKey] || curatedCollection || []).map((s, i) => ({
          ...s,
          id: s.id || `fallback-${langKey}-${i}`,
          albumArt: s.albumArt || getTrackArtwork({ title: s.title, artist: s.artist, language: langKey, seed: s.id || `fallback-${langKey}-${i}` }),
          duration: s.duration || formatDuration(0),
          previewUrl: s.url || s.previewUrl || '',
          url: s.url || s.previewUrl || '',
          language: langKey,
        }));
        final = fallback.slice(0, 20);
      }

      // Cache and update state
      apiCache[langKey] = final;
      setMasterTracks(final);
      if (!queueInitializedRef.current) {
        setQueueItems(final);
        queueInitializedRef.current = true;
      }
      setLibrary((prev) => {
        const merged = [...final, ...prev];
        const seen = new Set();
        return merged.filter((s) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        });
      });
      setCurrentSong((c) => c || (final[0] || null));
      setStatus((s) => ({ ...s, loading: false }));
      return final;
    } catch (err) {
      console.warn('Recommendation fetch failed for', langKey, err);
      // On error, fallback to local curated
      const fallback = (localCuratedByLanguage[langKey] || curatedCollection).slice(0, 20).map((s, i) => ({
        ...s,
        id: s.id || `fallback-${langKey}-${i}`,
        albumArt: s.albumArt || getTrackArtwork({ title: s.title, artist: s.artist, language: langKey, seed: s.id || `fallback-${langKey}-${i}` }),
        duration: s.duration || formatDuration(0),
        previewUrl: s.url || s.previewUrl || '',
        url: s.url || s.previewUrl || '',
        language: langKey,
      }));
      setMasterTracks(fallback);
      if (!queueInitializedRef.current) {
        setQueueItems(fallback);
        queueInitializedRef.current = true;
      }
      setLibrary((prev) => {
        const merged = [...fallback, ...prev];
        const seen = new Set();
        return merged.filter((s) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        });
      });
      setCurrentSong((c) => c || (fallback[0] || null));
      setStatus((s) => ({ ...s, loading: false }));
      return fallback;
    }
  };

  // Initialize single audio element once
  useEffect(() => {
    if (audioRef.current) return;
    const a = new Audio();
    a.preload = 'metadata';
    a.crossOrigin = 'anonymous';
    a.volume = volume;

    const onTime = () => setCurrentTime(a.currentTime || 0);
    const onDuration = () => setDuration(a.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      // auto-play next
      playNextSong();
    };
    const onPlayEvent = () => setIsPlaying(true);
    const onPauseEvent = () => setIsPlaying(false);

    a.addEventListener('timeupdate', onTime);
    a.addEventListener('durationchange', onDuration);
    a.addEventListener('ended', onEnded);
    a.addEventListener('play', onPlayEvent);
    a.addEventListener('pause', onPauseEvent);

    audioRef.current = a;

    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('durationchange', onDuration);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('play', onPlayEvent);
      a.removeEventListener('pause', onPauseEvent);
      try { a.pause(); } catch {}
      audioRef.current = null;
    };
  }, []);

  // Keep audio volume in sync
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // When currentSong changes, update audio src and play if requested
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!currentSong) {
      a.pause();
      a.src = '';
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      return;
    }
    // set src and metadata
    const src = currentSong.url || currentSong.previewUrl || currentSong.streamUrl || '';
    if (src && a.src !== src) {
      a.src = src;
    }
    // attempt to play if isPlaying is true, otherwise leave paused
    if (isPlaying) {
      const playPromise = a.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => setIsPlaying(false));
      }
    }
  }, [currentSong]);

  // Rotate featured hero item every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % (library.length || curatedCollection.length));
    }, 8000);
    return () => clearInterval(interval);
  }, [library.length]);

  // Parallax handler for hero
  useEffect(() => {
    const onMove = (e) => {
      const rect = document.getElementById('hero-card')?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12; // degrees
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      setHeroTilt({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrateReleaseArtwork = async () => {
      const seenArtwork = new Set();
      const hydrated = await Promise.all(
        curatedCollection.map(async (song) => {
          // Instrumental tracks intentionally keep their generated abstract art.
          if (song.language === 'instrumental') return song;
          try {
            const albumArt = await findReleaseArtwork(song);
            if (!albumArt || seenArtwork.has(albumArt)) return song;
            seenArtwork.add(albumArt);
            return { ...song, albumArt };
          } catch {
            return song;
          }
        })
      );

      if (cancelled) return;
      setLibrary((current) => current.map((song) => hydrated.find((item) => item.id === song.id) || song));
      setMasterTracks((current) => current.map((song) => hydrated.find((item) => item.id === song.id) || song));
      setCurrentSong((current) => hydrated.find((item) => item.id === current?.id) || current);
    };

    hydrateReleaseArtwork();
    return () => { cancelled = true; };
  }, []);

  const visibleSongs = useMemo(() => {
    if (!Array.isArray(masterTracks)) return [];
    if (selectedLanguage === "all") return masterTracks;
    const target = String(selectedLanguage || '').toLowerCase();
    return masterTracks.filter((song) => String(song.language || '').toLowerCase() === target);
  }, [masterTracks, selectedLanguage]);

  const featuredAlbums = useMemo(() => {
    const seen = new Set();
    const albums = [];
    for (const s of visibleSongs) {
      const key = `${(s.title || '').toLowerCase()}__${(s.artist || '').toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        albums.push(s);
      }
      if (albums.length >= 12) break;
    }
    return albums;
  }, [visibleSongs]);

  const artistRecommendations = useMemo(() => {
    const map = new Map();
    for (const s of visibleSongs) {
      const name = (s.artist || 'Unknown').trim();
      if (!map.has(name)) map.set(name, { name, count: 0, sample: s });
      map.get(name).count += 1;
    }
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((r) => ({ name: r.name, sample: r.sample }));
  }, [visibleSongs]);

  const languageName = selectedLanguage === 'all'
    ? 'All languages'
    : selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1);

  const languagePlaylists = useMemo(() => userPlaylists
    .map((playlist) => ({
      ...playlist,
      songs: selectedLanguage === 'all' ? playlist.songs : playlist.songs.filter((song) => String(song.language || '').toLowerCase() === String(selectedLanguage || '').toLowerCase()),
    }))
    .filter((playlist) => selectedLanguage === 'all' || playlist.songs.length), [userPlaylists, selectedLanguage]);

  const filteredCount = visibleSongs.length;

  // Do NOT rebuild or replace the global queue when the UI filter changes.
  // The queue is initialized once when we populate masterTracks and thereafter
  // only updated by explicit user actions (add/remove/reorder).
  const favouriteIds = useMemo(
    () => new Set(favorites.map((song) => song.id)),
    [favorites]
  );
  const mostPlayed = useMemo(() => {
    const pairs = Object.entries(playCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    return pairs
      .map(([id, count]) => {
        const song = visibleSongs.find((item) => item.id === id);
        if (!song) return null;
        return { ...song, plays: count };
      })
      .filter(Boolean);
  }, [playCounts, visibleSongs]);

  // NOTE: Do NOT change `currentSong` when the UI filter changes. Playback
  // must remain independent from language selection. The initial current
  // song is set by the recommendation bootstrap or user actions only.

  // When the selected language changes, use the shared recommendation service
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const fetched = await fetchRecommendations(selectedLanguage || 'all');
        if (!cancelled) {
          // Language selection only affects UI. Do not modify the global queue here.
          // (The UI will re-render from `visibleSongs` which derives from `masterTracks`.)
        }
      } catch (err) {
        console.warn('Language fetch failed', err);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [selectedLanguage]);

  const handleSearch = async () => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setMasterTracks(library);
      setStatus((prev) => ({ ...prev, error: null }));
      return;
    }

    try {
      const onlineResults = await searchOnlineSongs(trimmed);
      const normalized = normalizeSongs(onlineResults);

      if (!normalized.length) {
        throw new Error("No remote matches");
      }

      setLibrary((prev) => {
        const merged = [...normalized, ...prev];
        const seen = new Set();
        return merged.filter((song) => {
          if (seen.has(song.id)) return false;
          seen.add(song.id);
          return true;
        });
      });

      setMasterTracks(normalized);
      setCurrentSong(normalized[0]);
      setStatus({ loading: false, error: null });
    } catch (error) {
      console.warn("Falling back to internal sources:", error);
      try {
        const payload = await searchSongs(trimmed);
        const normalized = normalizeSongs(payload);
        setMasterTracks(normalized);
        setCurrentSong(normalized[0]);
        setStatus({
          loading: false,
          error: normalized.length ? "Showing internal catalogue results." : `No songs found for “${trimmed}”.`,
        });
      } catch (fallbackError) {
        console.warn("Local API unavailable, filtering cached library.", fallbackError);
        const localMatches = library.filter((song) => {
          const haystack = `${song.title} ${song.artist} ${song.mood}`.toLowerCase();
          return haystack.includes(trimmed.toLowerCase());
        });

        setMasterTracks(localMatches);
        setStatus({
          loading: false,
          error: localMatches.length
            ? `Showing offline matches for “${trimmed}”.`
            : `No songs found for “${trimmed}”.`,
        });
      }
    }
  };

  // Centralized playback function used by all UI parts
  const playTrack = (track) => {
    if (!track) return;
    // Ensure there's a global queue. Do not rebuild it on language changes.
    if (!queueItems || !queueItems.length) {
      setQueueItems(masterTracks);
    } else if (!queueItems.some((s) => s.id === track.id)) {
      // If the selected track isn't in the queue, append it (do not replace).
      setQueueItems((prev) => [...prev, track]);
    }

    setCurrentSong(track);
    setIsPlaying(true);

    // ensure audio plays previewUrl when available
    const a = audioRef.current;
    const src = track.previewUrl || track.url || track.streamUrl || '';
    if (a) {
      try {
        if (a.src !== src) a.src = src;
      } catch {}
      const p = a.play();
      if (p && typeof p.then === 'function') p.catch(() => setIsPlaying(false));
    }

    // bump play counts for analytics
    setPlayCounts((prev) => ({ ...prev, [track.id]: (prev[track.id] || 0) + 1 }));
  };

  // Expose a lightweight global API for page components to interact with
  useEffect(() => {
    window.playerAPI = window.playerAPI || {};
    window.playerAPI.playTrack = playTrack;
    window.playerAPI.getMasterTracks = () => masterTracks;
    window.playerAPI.setQueue = (q) => setQueueItems(Array.isArray(q) ? q : []);
    return () => {
      // do not remove other integration keys if present
      if (window.playerAPI && window.playerAPI.playTrack === playTrack) delete window.playerAPI.playTrack;
      if (window.playerAPI && window.playerAPI.getMasterTracks) delete window.playerAPI.getMasterTracks;
      if (window.playerAPI && window.playerAPI.setQueue) delete window.playerAPI.setQueue;
    };
  }, [masterTracks, playTrack]);

  const handleSongClick = (song) => playTrack(song);

  const handlePlay = () => {
    if (!currentSong && masterTracks && masterTracks.length) {
      playTrack(masterTracks[0]);
      return;
    }
    if (currentSong) playTrack(currentSong);
  };

  const handlePause = () => {
    const a = audioRef.current;
    if (a) a.pause();
    setIsPlaying(false);
  };

  const playNextSong = () => {
    if (!queueItems.length) return;
    const currentIndex = queueItems.findIndex((song) => song.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % queueItems.length;
    const next = queueItems[nextIndex];
    playTrack(next);
  };

  const playPreviousSong = () => {
    if (!queueItems.length) return;
    const currentIndex = queueItems.findIndex((song) => song.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + queueItems.length) % queueItems.length;
    const prev = queueItems[prevIndex];
    playTrack(prev);
  };

  const heroSubtitle = isPlaying
    ? "Streaming in studio-grade clarity."
    : "Select a track to start your private session.";

  const toggleFavourite = (song) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === song.id)) {
        return prev.filter((item) => item.id !== song.id);
      }
      return [...prev, song];
    });
  };

  const handlePlaylistCreate = (event) => {
    event.preventDefault();
    const trimmed = newPlaylist.trim();
    if (!trimmed) return;
    setUserPlaylists((prev) => [
      ...prev,
      { id: `playlist-${Date.now()}`, name: trimmed, songs: [] },
    ]);
    setNewPlaylist("");
  };

  const handleAddCurrentSongToPlaylist = (playlistId) => {
    if (!currentSong) return;
    setUserPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: playlist.songs.some((song) => song.id === currentSong.id)
                ? playlist.songs
                : [...playlist.songs, currentSong],
            }
          : playlist
      )
    );
  };

  const heroMetrics = [
    { label: 'Tracks in rotation', value: String(filteredCount).padStart(2, '0') },
    { label: 'Saved favourites', value: String(favorites.length).padStart(2, '0') },
    { label: 'Custom playlists', value: String(userPlaylists.length).padStart(2, '0') },
  ];

  // Retained only for the hidden legacy markup below while the dedicated queue owns the UI.
  const queuePreview = [];

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={onCloseSearch}
        songs={masterTracks}
        playlists={languagePlaylists}
        onPlay={handleSongClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <MiniPlayer
        song={currentSong}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onPrevious={playPreviousSong}
        onNext={playNextSong}
      />

      <section className="space-y-8 lg:space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="glass-panel relative overflow-hidden rounded-card border border-white/[0.08] p-5 shadow-float sm:p-6 lg:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(169,112,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(124,92,252,0.14),transparent_38%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="section-eyebrow">{languageName} sessions</span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-gramophone-text-secondary">
                {status.loading ? 'Refreshing catalogue' : 'Studio-grade streaming'}
              </span>
              {user && (
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-gramophone-text-secondary">
                  Welcome back, {user.firstName || 'listener'}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-gramophone-text">
                Private Listening Suite
              </h1>
              <p className="max-w-2xl text-body text-gramophone-text-secondary sm:text-[1.05rem]">
                Experience an editorially curated catalogue with cinematic spacing, premium motion, and a dark glass aesthetic designed for desktop and mobile alike.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <PremiumButton variant="primary" size="lg" onClick={() => handlePlay()}>
                Play Now
              </PremiumButton>
              <PremiumButton variant="secondary" size="lg" onClick={() => setSelectedLanguage('all')}>
                Explore Music
              </PremiumButton>
              <PremiumButton variant="ghost" size="lg" onClick={playNextSong}>
                Next in Queue
              </PremiumButton>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[20px] border border-white/[0.08] bg-white/[0.04] px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-gramophone-text-secondary">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-gramophone-text">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem]">
              <motion.div
                id="hero-card"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-card border border-white/[0.08] bg-gradient-to-br from-gramophone-card/70 to-gramophone-bg/80 p-6 shadow-float"
                style={{ perspective: 1000 }}
            >
              <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2b1236] via-[#1b1f3a] to-[#041022]"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                style={{ filter: 'blur(48px) brightness(0.9) contrast(1.05)' }}
            />

              <div className="relative grid gap-4 lg:grid-cols-[1fr_0.9fr] items-center">
                <motion.div
                  className="relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {(() => {
                    const featured = library[featuredIndex] || curatedCollection[featuredIndex % curatedCollection.length];
                    const artwork = featured && (featured.albumArt || getTrackArtwork({ ...featured, seed: featured.id }));
                      return (
                      <motion.img
                        src={artwork}
                        alt={featured?.title || 'Featured album'}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }}
                        className="aspect-[4/5] w-full max-w-[22rem] rounded-card object-cover shadow-card"
                        style={{ transform: `rotateY(${heroTilt.x}deg) rotateX(${heroTilt.y}deg)` }}
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                    );
                  })()}
                </motion.div>

                <div className="px-2">
                  {(() => {
                    const featured = library[featuredIndex] || curatedCollection[featuredIndex % curatedCollection.length];
                    return (
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-gramophone-accent">{featured?.mood || featured?.genre || 'Featured'}</p>
                        <h2 className="text-3xl font-extrabold leading-tight text-gramophone-text">{featured?.title}</h2>
                        <p className="text-lg font-semibold text-gramophone-text-secondary">{featured?.artist}</p>
                        <p className="max-w-md mt-2 text-sm text-gramophone-text-secondary">{featured?.description || `A premium selection from our editors — enjoy ${featured?.title || 'this selection'} in cinematic quality.`}</p>

                        <div className="flex items-center gap-3 mt-4">
                          <button type="button" onClick={() => { handleSongClick(featured); }} className="inline-flex items-center gap-3 px-5 py-3 text-sm font-semibold text-white rounded-full focus-ring bg-gradient-to-br from-gramophone-accent-secondary to-gramophone-accent shadow-glow">
                            <Play className="w-4 h-4" /> Play
                          </button>
                          <button type="button" onClick={() => toggleFavourite(featured)} className={`focus-ring inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 text-sm font-medium ${favouriteIds.has(featured?.id) ? 'text-gramophone-accent' : 'text-gramophone-text-secondary'}`}>
                            <Heart className="w-4 h-4" /> {favouriteIds.has(featured?.id) ? 'Saved' : 'Save'}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="flex items-center justify-start gap-4">
        <LanguageFilter value={selectedLanguage} onChange={setSelectedLanguage} options={languageOptions} />
      </section>

      {status.error && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="status-banner"
          role="status"
        >
          {status.error}
        </motion.p>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Discover</p>
            <h2 className="mt-1 section-heading">Trending now</h2>
          </div>
          <span className="hidden text-sm text-gramophone-text-secondary md:block">Pulse inspired by global charts</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {status.loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[22px] border border-white/[0.06] bg-gramophone-card/80 p-5">
                <div className="w-1/3 h-5 mb-3 skeleton" />
                <div className="w-3/4 h-6 mb-2 skeleton" />
                <div className="w-1/2 h-4 mb-1 skeleton" />
                <div className="w-full h-3 mt-4 skeleton" />
              </div>
            ))
          ) : (
            <> 
              {visibleSongs.slice(0, 4).map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="rounded-[22px] border border-white/[0.08] bg-gramophone-card/80 p-5 shadow-card"
                >
                  <p className="text-caption uppercase tracking-[0.18em] text-gramophone-accent">{languageName} trending</p>
                  <h3 className="mt-3 text-card-title text-gramophone-text">{item.title}</h3>
                  <p className="mt-2 text-sm text-gramophone-text-secondary">{item.artist}</p>
                  <p className="mt-4 text-sm text-gramophone-muted">{item.mood || 'Recommended for your next session.'}</p>
                </motion.article>
              ))}
              {!visibleSongs.length && <div className="md:col-span-2 xl:col-span-4"><PremiumEmptyState language={languageName} /></div>}
            </>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Library</p>
            <h2 className="mt-1 section-heading">Featured albums</h2>
          </div>
          <span className="hidden text-sm text-gramophone-text-secondary md:block">Curated picks for you</span>
        </div>

        {status.loading ? (
          <p className="empty-state">Loading the catalogue...</p>
        ) : visibleSongs.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {featuredAlbums.map((song) => (
              <AlbumCard
                key={song.id}
                song={song}
                onPlay={handleSongClick}
                onToggleFav={toggleFavourite}
                isActive={currentSong?.id === song.id}
                isFavourite={favouriteIds.has(song.id)}
              />
            ))}
          </div>
        ) : (
          <PremiumEmptyState language={languageName} />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <div id="full-music-player" className="p-5 glass-panel sm:p-6 lg:p-7 scroll-mt-32">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-eyebrow">Now Playing</p>
                <h3 className="mt-1 text-card-title text-gramophone-text">{currentSong?.title}</h3>
                <p className="mt-1 text-gramophone-text-secondary">{currentSong?.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={playPreviousSong} className="focus-ring rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-gramophone-text-secondary transition hover:bg-white/[0.08] hover:text-gramophone-text">
                  Prev
                </button>
                <button
                  onClick={() => (isPlaying ? handlePause() : handlePlay())}
                  className="focus-ring rounded-full bg-gradient-to-r from-gramophone-accent-secondary to-gramophone-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition hover:shadow-glow"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={playNextSong} className="focus-ring rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-gramophone-text-secondary transition hover:bg-white/[0.08] hover:text-gramophone-text">
                  Next
                </button>
              </div>
            </div>

            <div className="mt-6">
              <PremiumPlayer
                song={currentSong}
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                onPrevious={playPreviousSong}
                onNext={playNextSong}
                isFavourite={currentSong ? favouriteIds.has(currentSong.id) : false}
                onToggleFavourite={() => currentSong && toggleFavourite(currentSong)}
                onQueue={() => document.getElementById('player-queue')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                onSeek={(value) => {
                  if (audioRef.current) audioRef.current.currentTime = Number(value);
                  setCurrentTime(Number(value));
                }}
                onVolumeChange={(v) => setVolume(Number(v))}
              />
            </div>
          </div>

          <div id="full-music-player" className="p-5 glass-panel sm:p-6 lg:p-7 scroll-mt-32">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="section-eyebrow">Editorial</p>
                <h3 className="mt-1 text-card-title text-gramophone-text">Curator notes</h3>
              </div>
              <span className="text-sm text-gramophone-text-secondary">{userPlaylists.length} custom stacks</span>
            </div>
            <div className="grid gap-4 mt-5 md:grid-cols-3">
              {editorialShelves.map((shelf) => (
                <div key={shelf.title} className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-gramophone-text">{shelf.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gramophone-accent">{shelf.curator}</p>
                  <p className="mt-3 text-sm text-gramophone-text-secondary">{shelf.summary}</p>
                  <p className="mt-4 text-caption text-gramophone-muted">{shelf.count} tracks</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <QueuePanel
            songs={queueItems}
            currentSong={currentSong}
            favouriteIds={favouriteIds}
            onPlay={handleSongClick}
            onToggleFavourite={toggleFavourite}
            onRemove={(id) => setQueueItems((items) => items.filter((song) => song.id !== id))}
            onReorder={setQueueItems}
          />
          <div className="hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow">Queue</p>
                <h3 className="mt-1 text-card-title text-gramophone-text">Curated queue</h3>
              </div>
              <span className="text-sm text-gramophone-text-secondary">{filteredCount} tracks</span>
            </div>

            <div className="mt-5 flex max-h-[460px] flex-col gap-2 overflow-auto pr-1">
              {queuePreview.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => handleSongClick(song)}
                  className={`queue-item-glow flex w-full items-center gap-3 rounded-[18px] border px-3 py-2.5 text-left transition ${
                    currentSong?.id === song.id
                      ? 'border-gramophone-accent/30 bg-white/[0.05]'
                      : 'border-transparent bg-white/[0.02] hover:border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <img src={song.albumArt || getTrackArtwork({ title: song.title, artist: song.artist, language: song.language, seed: song.id })} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-album.png'; }} className="h-11 w-11 rounded-[14px] object-cover" />
                  <div className="flex-1 min-w-0">
                    <strong className="text-sm truncate text-gramophone-text">{song.title}</strong>
                    <p className="text-xs truncate text-gramophone-text-secondary">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gramophone-text-secondary">{song.duration}</span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavourite(song);
                      }}
                      className={`rounded-full p-2 text-sm transition ${
                        favouriteIds.has(song.id)
                          ? 'text-gramophone-accent'
                          : 'text-gramophone-text-secondary hover:text-gramophone-text'
                      }`}
                      aria-label="Toggle favourite"
                    >
                      {favouriteIds.has(song.id) ? '♥' : '♡'}
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Listening Rooms removed — section intentionally omitted to keep layout compact */}
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="p-5 glass-panel sm:p-6 lg:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Library tools</p>
              <h3 className="mt-1 text-card-title text-gramophone-text">Your playlists</h3>
            </div>
            <span className="text-sm text-gramophone-text-secondary">{userPlaylists.reduce((total, playlist) => total + playlist.songs.length, 0)} saved tracks</span>
          </div>

          <form onSubmit={handlePlaylistCreate} className="flex flex-col gap-3 mt-5 sm:flex-row">
            <input
              value={newPlaylist}
              onChange={(event) => setNewPlaylist(event.target.value)}
              placeholder="Create a new playlist"
              className="focus-ring min-w-0 flex-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-gramophone-text placeholder:text-gramophone-muted"
            />
            <PremiumButton type="submit" variant="secondary" size="md">
              Add Playlist
            </PremiumButton>
          </form>

          <div className="mt-5 space-y-3">
            {languagePlaylists.map((playlist) => (
              <div key={playlist.id} className="rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gramophone-text">{playlist.name}</p>
                    <p className="mt-1 text-sm text-gramophone-text-secondary">{playlist.songs.length} tracks saved</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddCurrentSongToPlaylist(playlist.id)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-gramophone-text-secondary transition hover:border-gramophone-accent/30 hover:text-gramophone-text"
                  >
                    Add current
                  </button>
                </div>
                {playlist.songs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {playlist.songs.slice(0, 4).map((song) => (
                      <span key={song.id} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-gramophone-text-secondary">
                        {song.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!languagePlaylists.length && <PremiumEmptyState language={languageName} compact />}
          </div>
        </div>

        <div className="p-5 glass-panel sm:p-6 lg:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Activity</p>
              <h3 className="mt-1 text-card-title text-gramophone-text">Most played</h3>
            </div>
            <span className="text-sm text-gramophone-text-secondary">Based on this session</span>
          </div>

          <div className="mt-5 space-y-3">
            {mostPlayed.length ? (
              mostPlayed.map((song) => (
                <div key={song.id} className="rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-gramophone-text">{song.title}</p>
                      <p className="text-sm truncate text-gramophone-text-secondary">{song.artist}</p>
                    </div>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-caption text-gramophone-text-secondary">
                      {song.plays} plays
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">Start playback to build a listening profile.</p>
            )}
          </div>
        </div>
      </section>
    </section>
    </>
  );
};

const PremiumEmptyState = ({ language, compact = false }) => (
  <div className={`${compact ? 'absolute inset-0 z-10 flex items-center justify-center bg-gramophone-bg/94 p-6 text-center' : 'rounded-[22px] border border-dashed border-gramophone-accent/35 bg-gradient-to-br from-gramophone-accent/10 via-white/[0.03] to-transparent p-8 text-center'}`}>
    <div>
      <span className="inline-flex items-center justify-center text-xl border h-11 w-11 rounded-2xl border-gramophone-accent/30 bg-gramophone-accent/10 text-gramophone-accent">♪</span>
      <h3 className="mt-3 text-base font-semibold text-gramophone-text">No {language} songs yet</h3>
      <p className="max-w-sm mt-1 text-sm text-gramophone-text-secondary">New releases and hand-picked recommendations will appear here when they are available.</p>
    </div>
  </div>
);

export default MusicPlayer;
