import Link from 'next/link';
import {useUser} from '@auth0/nextjs-auth0/client'; //lets us know if user is logged in or not auto from auth0
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { Logo } from '../logo';


export const AppLayout = ({children}) => {

    const {user} = useUser(); //check to see if user exists
    //this app layout will go to all pages except the home page in index.js

    //to do this we will pass the app layout into the native getLayout function of nextjs

    return (
        //tailwind allows inline-grid styling and underscore completes the class name
        //one col width of 300px and the other fills the space of the screen
        <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
            <div className="flex flex-col text-white overflow-hidden">
                <div className="bg-slate-800 px-2">
                    <Logo />
                    {/* tracking-wider gives space between letters of buttons */}
                    <Link href="/post/new" className="btn">New Post</Link>
                    <Link href="/token-topup" className="block mt-2 text-center">
                        <FontAwesomeIcon icon={faCoins} className="text-yellow-500"/>
                     <span className="pl-1"> 0 tokens Available</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">lists of posts</div>
                <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50" h-20 px-2>
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

        <div className='min-w-[50px]'>
        <Image className="rounded-full" src={user.picture} alt={user.name} height={50} width={50}></Image>
        </div>
      
      <div className='flex-1'>
        <div className='font-bold'>{user.email}</div>
        <Link className="text-sm" href="/api/auth/logout">Logout</Link>
      </div>
     
      </> 
      
      
      : <Link href="/api/auth/login">Login</Link>} </div>
            </div>
        
             <div>{children}</div>
        </div>
    )
}