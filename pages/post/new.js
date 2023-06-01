import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";



export default function NewPost() {
    //tailwind css comes with reset css out of the box for consistency across browsers
    //pages provide routes to this home page

    const [postContent, setPostContent] = useState("");

    const handleClick = async () => {
        //calls browser built in fetch call and is async because it returns a promis
        {/* @ts-expect-error Async Server Component */}
        const response = await fetch(`/api/generatePost`, {
            method: 'POST',
        });
        
        const json = await response.json();
        console.log('RESULT', json.post.postContent);
        setPostContent(json.post.postContent);
    }
      return <div> 
        <h1>This is the new post page</h1>
        <button className="btn" onClick={handleClick}>
            Generate
        </button>
        <div className="max-w-screen-sm p-10" dangerouslySetInnerHTML={{__html: postContent}}></div>
         </div>;
    }
    

    //for this to work, we have to add it to our _app.js
    NewPost.getLayout = function getLayout(page, pageProps) {
        return <AppLayout {...pageProps}>{page}</AppLayout>
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