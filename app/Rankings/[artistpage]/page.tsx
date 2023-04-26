async function getReviews(artist: string, album: string) {
    const res = await fetch(`http://127.0.0.1:8090/api/collections/reviews/records?page=1&perPage=30&sort=-updated&artist=${artist}&album=${album}`, { cache: 'no-store' });
    const data = await res.json();
    return data;
}

export default async function artistPage({ params, query }: any) {
    const artist = query?.artist as string;
    const album = query?.album as string;
    console.log('Artist:', artist, 'Album:', album);
    // const reviews = await getReviews(artist, album);
    return (
        <div>
            <h1>Complete Reviews</h1>
            <h2>{album}</h2>
            <h3>{artist}</h3>
            {/* {reviews && reviews.map((review: any) => (
                <div key={review.id}>
                    <p>{review.title}</p>
                    <p>{review.content}</p>
                </div>
            ))} */}
        </div>
    )
}

