import Link from 'next/link';
import React from 'react';
import styles from './Rankings.module.css';
import CreateReview from './CreateReview';
import { FaCrown, FaFire, FaClock, FaChartLine } from 'react-icons/fa';

async function getAlbums() {
  const res = await fetch('http://127.0.0.1:8090/api/collections/reviews/records?page=1&perPage=30&sort=-updated', { cache: 'no-store' });
  const data = await res.json();
  return data?.items as any[];
}



async function getTopAlbums() {
  const albums = await getAlbums();

  const albumRatings = albums.reduce((acc, album) => {
    const { album: albumName, artist, rating } = album;
    const albumKey = `${albumName} - ${artist}`;
    if (acc[albumKey]) {
      acc[albumKey].count += 1;
      acc[albumKey].total += rating;
    } else {
      acc[albumKey] = { count: 1, total: rating };
    }
    return acc;
  }, {});

  const topAlbums = Object.keys(albumRatings).map((albumKey) => {
    const avgRating = albumRatings[albumKey].total / albumRatings[albumKey].count;
    const [albumName, artist] = albumKey.split(" - ");
    return { albumName, artist, avgRating };
  });

  topAlbums.sort((a, b) => b.avgRating - a.avgRating);

  return topAlbums;
}


async function getHotAlbums() {
  const albums = await getAlbums();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7); // set cutoff date to 7 days ago

  const hotAlbums = albums
    .filter((album) => {
      const reviewDate = new Date(album.updated);
      return reviewDate > cutoffDate; // only keep reviews from less than a week ago
    })
    .reduce((acc, album) => {
      const { album: albumName, artist, rating } = album;
      const key = `${albumName} - ${artist}`; // include artist name in key
      if (acc[key]) {
        acc[key].count += 1;
        acc[key].total += rating;
      } else {
        acc[key] = { count: 1, total: rating };
      }
      return acc;
    }, {});

  const topAlbums = Object.keys(hotAlbums).map((albumKey) => {
    const avgRating = hotAlbums[albumKey].total / hotAlbums[albumKey].count;
    const [albumName, artist] = albumKey.split(" - "); // split album and artist names
    return { albumName, artist, avgRating };
  });

  topAlbums.sort((a, b) => b.avgRating - a.avgRating);

  return topAlbums;
}

interface LastfmAlbum {
  name: string;
  artist: string;
  mbid: string;
  // Add more properties as needed
  image: {
    size: string;
    '#text': string;
  }[];
}

async function getLastfmAlbumInfo(artist: string, album: string, apiKey: string): Promise<LastfmAlbum> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return data?.album;
}

export default async function HomePage() {
  const topAlbums = await getTopAlbums();
  const albums = await getAlbums();
  const hotAlbums = await getHotAlbums();

  return (
    <div>
      <h1>
        <FaChartLine /> Top Charts
      </h1>
      <p>Discover who's hitting the highest notes</p>
      {/* <CreateReview /> */}
      <div className={styles['container']}>
        <div className={styles['column']}>
          <h3><FaCrown /> Top Albums</h3>
          <>
            {topAlbums.map(async (album) => {
              const lastfmAlbum = await getLastfmAlbumInfo(`${album.artist}`, `${album.albumName}`, '4eebd63c4e8dd080949c22e9a7b879d8');
              const mediumImageUrl = lastfmAlbum.image.find(image => image.size === 'medium')?.['#text'];
              // console.log('Url:',mediumImageUrl);
              return (
                <React.Fragment key={`${album.artist}-${album.albumName}`}>
                  <Ranking
                    album={album.albumName}
                    artist={album.artist}
                    rating={album.avgRating.toFixed(1)}
                    image={mediumImageUrl}
                  />
                </React.Fragment>
              );
            })}
          </>
        </div>


        <div className={styles['column']}>
          <h3><FaFire /> Hot Now</h3>
          <>
            {hotAlbums.map(async (album) => {
              const lastfmAlbum = await getLastfmAlbumInfo(`${album.artist}`, `${album.albumName}`, '4eebd63c4e8dd080949c22e9a7b879d8');
              const mediumImageUrl = lastfmAlbum.image.find(image => image.size === 'medium')?.['#text'];
              // console.log('Url:',mediumImageUrl);
              return (
                <React.Fragment key={`${album.artist}-${album.albumName}`}>
                  <Ranking
                    album={album.albumName}
                    artist={album.artist}
                    rating={album.avgRating.toFixed(1)}
                    image={mediumImageUrl}
                  />
                </React.Fragment>
              );
            })}
          </>
        </div>

        <div className={styles['column']}>
          
          <h3><FaClock /> Fresh Takes</h3>
          <div className={styles['recent-reviews']}>
            <>
              {albums?.map(async (review) => {
                const lastfmAlbum = await getLastfmAlbumInfo(`${review.artist}`, `${review.album}`, '4eebd63c4e8dd080949c22e9a7b879d8');
                
                const mediumImageUrl = lastfmAlbum ? lastfmAlbum.image.find(image => image.size === 'medium')?.['#text'] : undefined;
                return (
                  <React.Fragment key={`${review.artist}-${review.albumName}`}>
                    <RecentReview
                      key={review.id}
                      id={review.id}
                      album={review.album}
                      artist={review.artist}
                      rating={review.rating}
                      review={review.review}
                      time={review.updated}
                      image={mediumImageUrl}
                    />
                  </React.Fragment>
                );
              })}
            </>
          </div>

        </div>
      </div>
    </div>
  );
  
}

function Ranking({ album, artist, rating, image }: any) {
  return (
    <div className={styles["card"]}>
      <div className={styles["imageContainer"]}>
        <img src={image} alt='Art N/A' />
      </div>
      <div className={styles["content"]}>
        <h4>{album}</h4>
        <h5>{artist}</h5>
        <p>Average Rating: {rating}/10</p>
      </div>
    </div>
  );
}

function RecentReview({ id, album, artist, rating, review, time, image }: any) {
  const formattedTime = formatDate(time);
  return (
    <div className={styles["card"]}>
      <div className={styles["imageContainer"]}>
        <img src={image} alt='Art N/A' /> 
      </div>
      <div className={styles["content"]}>
        <h4>{album}</h4>
        <h5>{artist}</h5>
        <p>User Rating: {rating}/10</p>
        <p>"{review}"</p>
        <p className={styles["time"]}>{formattedTime}</p>
      </div>
    </div>
  );
}


function formatDate(dateTime: string) {
  const [date, time] = dateTime.split(' ');
  const [year, month, day] = date.split('-');
  const [hour, minutes] = time.split(':');
  const dateObj = new Date(`${year}-${month}-${day}T${hour}:${minutes}:00Z`);
  const formattedTime = dateObj.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  return `${month}/${day} ${formattedTime}`;
}


