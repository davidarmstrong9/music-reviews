'use client';
import styles from './Rankings.module.css';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateReview() {
  const [album, setAlbum] = useState('');
  const [artist, setArtist] = useState('');
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  const router = useRouter();

  const create = async() => {
    await fetch('http://127.0.0.1:8090/api/collections/reviews/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        album,
        artist,
        rating,
        review,
      }),
    });

    setAlbum('');
    setArtist('');
    setRating('');
    setReview('');

    router.refresh();
  }

  return (
    <div className={styles['form-wrapper']}>
      <div className={styles['form-container']}>
        <form onSubmit={create}>
          <h3>Create a new review</h3>
          <label htmlFor="album">Album:</label>
          <input
            type="text"
            id="album"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
          />
          <label htmlFor="artist">Artist:</label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          <label htmlFor="rating">Rating (out of 10):</label>
          <input
            type="number"
            id="rating"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <label htmlFor="review">Review:</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <button type="submit">Create Review</button>
        </form>
      </div>
    </div>
  );
}
