import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'

function MyApp({ Component, pageProps }) {

  //this _app.js name is a special name recognized by nextjs to wrap our entire app in a component

  // we must wrap our app in a userprovider so that auth0 can tailor the apps profile to the user
  //need userProvider to be able to leverage useUser in index.js
  return <UserProvider> 
          <Component {...pageProps} />
        </UserProvider>
}

export default MyApp
