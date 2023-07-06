import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";


export default function TokenTopup() {

    const handleClick = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/addTokens`, {
            method: 'POST'
      
        });
      const json = await response.json(); //make sure you add 'await'
      
     window.location.href = json.session.url; // console logging response reveals response body w/ url property that sends to stripe page
        

    }
    //tailwind css comes with reset css out of the box for consistency across browsers
    //pages provide routes to this home page
      return <div> 
        <h1>This is the token topup page</h1>
        <button className="btn" onClick={handleClick}>Add Tokens</button>
         </div>;
    }
    
    TokenTopup.getLayout = function getLayout(page, pageProps) {
        return <AppLayout {...pageProps}>{page}</AppLayout>
    }

    export const getServerSideProps = withPageAuthRequired({

      async getServerSideProps(ctx){
        const props = await getAppProps(ctx);
        return {
            props
        };
      }
    });