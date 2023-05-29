import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";


export default function TokenTopup() {
    //tailwind css comes with reset css out of the box for consistency across browsers
    //pages provide routes to this home page
      return <div> 
        <h1>This is the token topup page</h1>
         </div>;
    }
    
    TokenTopup.getLayout = function getLayout(page, pageProps) {
        return <AppLayout {...pageProps}>{page}</AppLayout>
    }

    export const getServerSideProps = withPageAuthRequired(() => {

        return {
            props: {
                
            }
        }
    });