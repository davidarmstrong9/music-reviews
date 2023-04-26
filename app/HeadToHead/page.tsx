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
const [artistOrder, setArtistOrder] = useState<string[]>([]);
const [correctlyAnswered, setCorrectlyAnswered] = useState<boolean>(false);
const [showLink, setShowLink] = useState<boolean>(false);
const [playCountVisible, setPlayCountVisible] = useState<boolean>(false);

useEffect(() => {
async function fetchTopArtists() {
const response = await fetch(
'https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=4eebd63c4e8dd080949c22e9a7b879d8&format=json'
);
const data = await response.json();
const artists = data?.artists?.artist || [];
console.log("Artists:",artists)
const artistNames = artists.map((artist: Artist) => artist.name).slice(0, 10);
const shuffledArtistOrder = shuffle(artistNames);
console.log("shuffle:",shuffledArtistOrder);
setTopArtists(artists);
setArtistOrder(shuffledArtistOrder);
setPlayCountVisible(false);
setShowLink(false);
setCorrectlyAnswered(false);
}
fetchTopArtists();
}, []);

const shuffle = (array: any[]) => {
const shuffledArray = [...array];
for (let i = shuffledArray.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
}
return shuffledArray;
};

const handleArtistClick = (artistName: string, ranking: number) => {
if (ranking === 1) {
setCorrectlyAnswered(true);
setShowLink(true);
setPlayCountVisible(true);
} else {
setCorrectlyAnswered(false);
}
};
return (
    <div>
      <h2>Guess the Top Artist of the Week:</h2>
      <ul>
        {artistOrder.map((artistName, index) => {
          const artist = topArtists.find((a) => a.name === artistName);
          const ranking = artistOrder.findIndex((name) => name === artistName) + 1;
          const isCorrectAnswer = ranking === 1 && correctlyAnswered;
          const isWrongAnswer = ranking !== 1 && correctlyAnswered;
          const color = isCorrectAnswer ? 'green' : isWrongAnswer ? 'red' : '';
          const link = isCorrectAnswer && showLink ? <button onClick={() => {window.location.href = '../FullArtists'}}>See full rankings</button> : null;
          const playcount = playCountVisible && isCorrectAnswer ? `Play count: ${artist?.playcount}` : '';
          return (
            <li key={artistName}>
              <span style={{ color }}>{correctlyAnswered ? ranking + '. ' : ''}</span>
              <span style={{ color, cursor: 'pointer' }} onClick={() => handleArtistClick(artistName, ranking)}>
                {artistName}
              </span>
              {playcount}
              {link}
            </li>
          );
        })}
      </ul>
    </div>
  );
}