import { withPageAuthRequired } from "@auth0/nextjs-auth0";



export default function NewPost() {
    //tailwind css comes with reset css out of the box for consistency across browsers
    //pages provide routes to this home page
      return <div> 
        <h1>This is the new post page</h1>
         </div>;
    }
    

    //function within nextjs that runs server side whenever this page is requested
    //can return objects or redirects
    //but auth0 takes care of that for us when wrapped with withPageAuthRequired
    //copy past this function into pages we want secured with login users
    export const getServerSideProps = withPageAuthRequired(() => {

        return {
            props: {
                
            }
        }
    });