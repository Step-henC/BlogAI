import Image from "next/image";
import HeroImage from '../public/hero.webp'
import { Logo } from "../components/logo";
import Link from "next/link";


export default function Home() {
//tailwind css comes with reset css out of the box for consistency across browsers
//pages provide routes to this home page

//.env.local file name will be automatically used by next.js for environment variables

//the [..auth] directory is automatically recognized by oauth 

//hero.webp was added by instructor




  return (
  
  <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative"> 
    
      <Image src={HeroImage} alt="hero" fill className="absolute"></Image>
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo/>
        <p>A SEO solution that leverages AI to return blog posts that fit personal requests.</p>
         <Link href="/post/new" className='btn'>Get Started!</Link>  
      </div>
    
    </div>
  );
}
