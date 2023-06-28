import {Configuration, OpenAIApi} from 'openai'; //instructor install openai already
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'; //wraps function in security from logged in users with auth0
import clientPromise from '../../lib/mongodb';


//npm start app auto gives an api example where the json here is the reponse to the call 
//add async
export default withApiAuthRequired(async function handler(req, res) {

    //check user and token
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db('BlogStandard');
    const userProfile = await db.collection("users").findOne({
        auth0Id: user.sub
    });

    if (!userProfile?.availableTokens) {
        res.status(401); // 403 means user is authorized but does not have permission (tokens ) for request
        return;
    }


    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });

    const openAi = new OpenAIApi(config); 


    const {topic, keywords} = req.body;

    

    //chat gpt4 is not publicly available yet
    // const response = await openAi.createCompletion({
    //     model: "text-davinci-003",
    //     temperature: 0, //zero is lowest risk, one is highest risk
    //     max_tokens: 3600,
    //     prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following keywords ${keywords}.
    //     The content should be formatted in SEO friendly HTML.
    //     The response must also include appropriate HTML title and meta description content.
    //     The return format must be stringified JSON in the following format:
    //     {
    //         "postContent": post content here
    //         "title": title goes here
    //         "metaDescription": meta description here
    //     }`,
    // });

    //above is the text-davinci-003 model of OpenAI, but now we will use Chat Gpt 3.5 turbo model
    //instead of createCompletion method there is a createChatCompletion
    //also will not be return JSON but instead receive postContent, title, and metaDescription separately
    //this will be more of a back and forth chat
    
    

    const postContentResponse = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0, //do not need max tokens anymore default set to infinity
        messages: [{ //no propmt just messages
            role: "system", //tells openAI how to behave in content
            content: "You are a blog post generator"
        }, {
            role:"user", 
            content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following keywords ${keywords}. 
            The blog post must be formatted in HTML, 
            limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`

        },]

    })

    const postContent = postContentResponse.data.choices[0]?.message?.content || "";

    const titleResponse = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0, //do not need max tokens anymore default set to infinity
        messages: [{ //no propmt just messages
            role: "system", //tells openAI how to behave in content
            content: "You are a blog post generator"
        }, {
            role:"user", 
            content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following keywords ${keywords}. 
            The blog post must be formatted in HTML, 
            limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`

        }, {
            role: "assistant", //this is the response returned from openai
            content: postContent
    }, {
        role: "user",
        content: "Generate an appropriate HTML title text for the above blog post"
    },]

    })


    const metaDescriptionResponse =  await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0, //do not need max tokens anymore default set to infinity
        messages: [{ //no propmt just messages
            role: "system", //tells openAI how to behave in content
            content: "You are a blog post generator"
        }, {
            role:"user", 
            content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following keywords ${keywords}. 
            The blog post must be formatted in HTML, 
            limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i`

        }, {
            role: "assistant", //this is the response returned from openai
            content: postContent
    }, {
        role: "user",
        content: "Generate an appropriate HTML formatted and SEO-friendly meta description content for the above blog post"
    }]

    })

    const title = titleResponse.data.choices[0]?.message?.content || "";
    const metaDescription = metaDescriptionResponse.data.choices[0]?.message?.content || "";

    console.log("POST CONTENT", postContent);
    console.log("TITLE", title);
    console.log("META DESCR", metaDescription);

    await db.collection("users").updateOne({
        auth0Id: user.sub
    }, {
        $inc: {
           availableTokens: -1
        }
    });

    const parsedJson = {
        postContent,
        title,
        metaDescription,
    }; 

    const post = await db.collection("posts").insertOne({ // store blog post in database

        postContent: parsedJson?.postContent,
        title: parsedJson?.title,
        metaDescription: parsedJson?.metaDescription,
        topic,
        keywords,
        userId: userProfile._id, //auto generated mongo ID
        created: new Date(),
    })

    console.log('post', post);

    res.status(200).json({
        postId: post.insertedId, //instead of directly calling post obj from chat-gpt, we call post id from mongo to populate existing posts
    })
  })
  