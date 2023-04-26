'use client';
import Link from 'next/link';
import CreateReview from './Rankings/CreateReview';
import SignUp from './Rankings/SignUp';
import Login from './Rankings/LogIn';
import { useRouter } from 'next/navigation';
// import {UserProvider} from '@auth0/nextjs-auth0';

export default function HomePage() {
  const router = useRouter();
  return (
    <div>
      <h1>AudioAuthority</h1>
      <h4>Discover who's hitting the highest notes.</h4>
      <p>Navigate to one of our pages to enjoy our music ranking features!</p>
      <div className='container'>
        <div className='column'>
          <Link href="/Rankings">
            <h3>Top Charts</h3>
          </Link>
          <h5>View Audio Authority's top rated, trending, and recently reviewed albums.</h5>
        </div>
        <div className='column'>
          <Link href="/HeadToHead">
            <h3>Head to Head!</h3>
          </Link>
          <h5>See if your favorite albums choices line up with Audio Authority's rankings.</h5>
        </div>
      </div>
      {/* <div className='container'> */}
        <CreateReview />
        {/* <div className='container'> */}
          <SignUp />
          <Login
            initialUsername=''
            initialPassword=''
            onLogin={() => router.push('/')}
          />
        {/* </div> */}
      {/* </div> */}
    </div>
  );
}
