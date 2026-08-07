import axios from 'axios';
import { getTrackArtwork } from '../utils/imageService';

const API_BASE_URL = 'http://localhost:3000/api'; // local API (optional)
const ITUNES_BASE_URL = 'https://itunes.apple.com';

const formatDuration = (milliseconds) => {
  if (!milliseconds) return '3:00';
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.round((milliseconds % 60000) / 1000)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const inferLanguageFromResult = (result) => {
  const genre = (result.primaryGenreName || '').toLowerCase();
  const artist = (result.artistName || '').toLowerCase();

  if (genre.includes('latin') || genre.includes('reggaeton') || genre.includes('spanish')) {
    return 'spanish';
  }
  if (genre.includes('instrumental') || genre.includes('ambient')) {
    return 'instrumental';
  }
  if (
    genre.includes('world') ||
    genre.includes('bollywood') ||
    artist.includes('arijit') ||
    artist.includes('pritam')
  ) {
    return 'hindi';
  }
  return 'english';
};

const transformOnlineResult = (item) => ({
  id: (item.trackId || item.collectionId || item.artistId || Date.now()).toString(),
  title: item.trackName || item.collectionName || 'Untitled session',
  artist: item.artistName || 'Unknown artist',
  mood: item.primaryGenreName || 'On-demand stream',
  duration: formatDuration(item.trackTimeMillis),
  albumArt: getTrackArtwork({
    title: item.trackName || item.collectionName || 'Untitled session',
    artist: item.artistName || 'Unknown artist',
    language: inferLanguageFromResult(item),
    seed: `${item.trackId || item.collectionId || item.artistId || Date.now()}`,
    albumArt: item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '500x500') : '',
  }),
  url: item.previewUrl || '',
  language: inferLanguageFromResult(item),
  description: item.collectionName || '',
});

// Resolve a release cover independently from the stream search. This keeps the
// offline catalogue visually accurate whenever the public catalogue is available.
export const findReleaseArtwork = async ({ title, artist, language }) => {
  const country = ['telugu', 'hindi'].includes(language) ? 'in' : 'gb';
  const response = await axios.get(`${ITUNES_BASE_URL}/search`, {
    params: {
      term: `${title} ${artist}`,
      media: 'music',
      entity: 'song',
      limit: 8,
      country,
    },
  });

  const normalise = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const requestedTitle = normalise(title);
  const requestedArtist = normalise(artist);
  const result = (response.data?.results || []).find((item) =>
    normalise(item.trackName).includes(requestedTitle) &&
    normalise(item.artistName).includes(requestedArtist.split(' ')[0])
  ) || (response.data?.results || []).find((item) => normalise(item.trackName).includes(requestedTitle));

  return result?.artworkUrl100
    ? result.artworkUrl100.replace('100x100', '1000x1000')
    : '';
};

// Fetch all songs from local API (optional, will fail gracefully if offline)
export const getsongs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching songs: ' + error.message);
  }
};

// Search songs by query in local API
export const searchSongs = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs/search`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw new Error('Error searching songs: ' + error.message);
  }
};

// Search online catalogue (iTunes public API)
export const searchOnlineSongs = async (query, options = {}) => {
  const { limit = 15, country = 'gb' } = options;
  try {
    const response = await axios.get(`${ITUNES_BASE_URL}/search`, {
      params: {
        term: query,
        media: 'music',
        limit,
        country,
        lang: 'en_us',
      },
    });

    return (response.data?.results || [])
      .filter((item) => !!item.previewUrl)
      .map(transformOnlineResult);
  } catch (error) {
    console.error('Error fetching from iTunes:', error);
    throw new Error('Unable to reach the online catalogue.');
  }
};
