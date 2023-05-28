import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Post() {
    //square brackets in the name create a dynamic route since the post value in URL can be any value (unique id)
      return <div> 
        <h1>This is the home page</h1>
         </div>;
    }
    

    export const getServerSideProps = withPageAuthRequired(() => {

        return {
            props: {
                
            }
        }
    });