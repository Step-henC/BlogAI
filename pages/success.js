import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";


export default function Success() {

 
    //tailwind css comes with reset css out of the box for consistency across browsers
    //pages provide routes to this home page
      return <div> 
        <h1>Thank you for your purchase! Happy Blogging!</h1>
      
         </div>;
    }
    
    Success.getLayout = function getLayout(page, pageProps) {
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