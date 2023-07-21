import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";



export default function NewPost() {
    const router = useRouter();
    //tailwind css comes with reset css out of the box for consistency across browsers
    //pages provide routes to this home page


    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState("");
    const [generating, setGenerating] = useState(false);
    
   

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevent default posting of this form to itself
        //calls browser built in fetch call and is async because it returns a promis
        {/* @ts-expect-error Async Server Component */}
        setGenerating(true);

        try {
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
    }catch(e) {
        setGenerating(false); //still gonna load spinner if api failure
    }
 
     
      
        // setTitle(json.post.title);
        // setMetaDescription(json.post.metaDescription);
    }
      return <div className=" h-full overflow-hidden"> 
      {generating && (
      <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
        <FontAwesomeIcon icon={faBrain} className="text-8xl"/>
        <h6>Generating ...</h6>
      </div>
)}
      {!generating && (
<div className="w-full h-full flex flex-col overflow-auto">
        <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
            <div>
                    <label>
                        <strong>
                            Generate a blog on the topic of:
                        </strong>
                    </label>
                    <textarea  maxLength={80} className="resize-none border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={topic} onChange={(e) => setTopic(e.target.value)}/>
            </div>
            <div>
            <label>
                        <strong>
                            Targeting the following keywords:
                        </strong>
                    </label>
                    <textarea maxLength={80} className="resize-none border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={keywords} onChange={(e) => setKeywords(e.target.value)}/>
                    <small className="display-block">
                        Separate keywords with a comma
                    </small>
            </div>
        <button type="submit" className="btn" disabled={!topic.trim() || !keywords.trim()}>
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
        
        </div>
)}
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
          if (!props.availableTokens) { //if no tkens, redirect to add tokens page
            return {
                redirect: {
                    destination: "/token-topup",
                    permanent: false
                }
            }
          }
          return {
              props
          };
        }
      });