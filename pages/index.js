import Link from 'next/link';
import {useUser} from '@auth0/nextjs-auth0/client'; //lets us know if user is logged in or not auto from auth0
import Image from 'next/image';
export default function Home() {
//tailwind css comes with reset css out of the box for consistency across browsers
//pages provide routes to this home page

//.env.local file name will be automatically used by next.js for environment variables

//the [..auth] directory is automatically recognized by oauth 

const {user} = useUser(); //check to see if user exists



  return <div> 
    <h1>This is the home page</h1>
    <div>
      {/* if user is set, render info from auth0 and logout button that we copy from login, if not render sign in link */}
      { !!user ? 
      
      
      <>
      {/* use nextjs image because of additional features
        Must add the domain of the auth0 image which is s.gravitar.com, to next.config.js
        add like: images: {
          domains: ['s.gravitar.com'],
        }
        rerun npm run dev due to config changes
        if no provided image, auth0 will make an image */}
      <Image src={user.picture} alt={user.name} height={50} width={50}></Image>
      <div>
        {user.email}
      </div>
      <Link href="/api/auth/logout">Logout</Link>
      </> 
      
      
      : <Link href="/api/auth/login">Login</Link>} 

    </div>
     </div>;
}
