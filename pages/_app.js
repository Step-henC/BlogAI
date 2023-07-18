import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import {DM_Sans, DM_Serif_Display} from '@next/font/google'
import { config } from "@fortawesome/fontawesome-svg-core/styles.css"

config.autoAddCss = false; //prevents massive fontawesome logo loading in production environment (not dev) that is a result
                            //of fontawesome loading before CSS

//make custom  classes in tailwind.config.js in the theme block by adding extend -> fontFamily
//then call those classes in className variable with font-yourCustomName
const dmSans = DM_Sans({
  weight: ['400', '500', 
'700'],
  subsets: ['latin'],
  variable: "--font-dm-sans"
});


const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: "--font-dm-serif"
});
function MyApp({ Component, pageProps }) {

  //check layout of component or just return the page of the component
  const getLayout = Component.getLayout || ((page) => page);



  //this _app.js name is a special name recognized by nextjs to wrap our entire app in a component

  // we must wrap our app in a userprovider so that auth0 can tailor the apps profile to the user
  //need userProvider to be able to leverage useUser in index.js
  return <UserProvider> 

        {/* instead of passing components, wrap the component in a get layout function passing the page and pageProps */}
        {/* wrap layout in main to make font specs available for entier app */}

       <main className={`${dmSans.variable} ${dmSerifDisplay.variable} font-body`}> {getLayout(<Component {...pageProps}/>, pageProps)}</main>
        
        </UserProvider>
}

export default MyApp
