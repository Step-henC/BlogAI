import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { clientPromise } from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default function Post(props) {
    //square brackets in the name create a dynamic route since the post value in URL can be any value (unique id)
      return <div> 
        <h1>This is the home page</h1>
         </div>;
    }
    

    Post.getLayout = function getLayout(page, pageProps) {
            return <AppLayout {...pageProps}>{page}</AppLayout>;

            
    };
    export const getServerSideProps = withPageAuthRequired({

        async getServerSideProps(context){

                const userSession = await getSession(context.req, context.res);
                const client = await clientPromise;
                const db = client.db("BlogStandard");
                const user = await db.collection('users').findOne({
                    auth0Id: userSession.user.sub
                });
                const post = await db.collection("posts").findOne({
                    _id: new ObjectId(context.params?.postId), // objectId in mongo is by time stamp so have to import it from mongo library
                    userId: user._id,
                })

                if (!post) {
                    return {
                        redirect: { //redirect is a nextjs object it is expecting could exist
                            destination: "/post/new",
                            permanent: false,
                        }
                    }
                }

                return {
                    props: {
                        postcontent: post.postcontent, // all from db
                        title: post.title,
                        metaDescription: post.metaDescription,
                        keywords: post.keywords
                    }
                }


        }
    });