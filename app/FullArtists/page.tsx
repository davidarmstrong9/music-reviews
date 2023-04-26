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
      console.log(artists);
      setTopArtists(artists);
    }
    fetchTopArtists();
  }, []);

  return (
    <div>
      <h2>Top Artists of the Week:</h2>
      <ul>
        {topArtists.map((artist) => (
          <li key={artist.name}>
            <a href={artist.url}>{artist.name}</a> ({artist.playcount} plays)
            
          </li>
        ))}
      </ul>
    </div>
  );
}