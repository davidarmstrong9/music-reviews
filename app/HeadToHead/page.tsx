'use client';
import { useEffect, useState } from 'react';

interface Artist {
  name: string;
  playcount: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
}

export default function HomePage() {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  useEffect(() => {
    async function fetchTopArtists() {
      const response = await fetch(
        'https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=4eebd63c4e8dd080949c22e9a7b879d8&format=json'
      );
      const data = await response.json();
      const artists = data?.artists?.artist || [];
      setTopArtists(artists);
    }
    fetchTopArtists();
  }, []);

  return (
    <div>
      <h1>Album Royale</h1>
      <p>May the best music win.</p>

      <h2>Top Artists of the Week:</h2>
      <ul>
        {topArtists.map((artist) => (
          <li key={artist.name}>
            <a href={artist.url}>{artist.name}</a> ({artist.playcount} plays)
            {artist.image.length > 0 && (
              <img src={artist.image[artist.image.length - 1]['#text']} alt={artist.name} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
