import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";



export default function NewPost() {
    const router = useRouter();
    //tailwind css comes with reset css out of the box for consistency across browsers
    //pages provide routes to this home page


    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState("");
    
   

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevent default posting of this form to itself
        //calls browser built in fetch call and is async because it returns a promis
        {/* @ts-expect-error Async Server Component */}
        const response = await fetch(`/api/generatePost`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({topic, keywords}),
        });
        
        const json = await response.json();
        if(json?.postId) {

            router.push(`/post/${json.postId}`);
        }
 
     
      
        // setTitle(json.post.title);
        // setMetaDescription(json.post.metaDescription);
    }
      return <div> 

        <form onSubmit={handleSubmit}>
            <div>
                    <label>
                        <strong>
                            Generate a blog on the topic of:
                        </strong>
                    </label>
                    <textarea className="resize-none border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={topic} onChange={(e) => setTopic(e.target.value)}/>
            </div>
            <div>
            <label>
                        <strong>
                            Targeting the following keywords:
                        </strong>
                    </label>
                    <textarea className="resize-none border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={keywords} onChange={(e) => setKeywords(e.target.value)}/>
            </div>
        <button type="submit" className="btn">
            Generate
        </button>
        </form>
{/*    
        <div className="max-w-screen-sm p-10" dangerouslySetInnerHTML={{__html: title}}></div>
        <div className="max-w-screen-sm p-10" dangerouslySetInnerHTML={{__html: metaDescription}}></div> */}
       {/* dangerouslySetInnerHTML={{__html: postContent.title}} */}
            {/* <h1 >{title}</h1>
            <h3>{postContent}</h3>
            <h3>{metaDescription}</h3> */}
        
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
    export const getServerSideProps = withPageAuthRequired({

        async getServerSideProps(ctx){
          const props = await getAppProps(ctx);
          return {
              props
          };
        }
      });