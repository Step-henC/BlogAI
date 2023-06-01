import {Configuration, OpenAIApi} from 'openai'; //instructor install openai already



//npm start app auto gives an api example where the json here is the reponse to the call 
//add async
export default async function handler(req, res) {

    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });

    const openAi = new OpenAIApi(config); 

    const topic = "Top 10 tips for Cat Oweners";

    const keywords = "first-time cat owners, common cat health problems, best cat breeds"

    //chat gpt4 is not available yet
    const response = await openAi.createCompletion({
        model: "text-davinci-003",
        temperature: 0, //zero is lowest risk, one is highest risk
        max_tokens: 3600,
        prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following keywords ${keywords}.
        The content should be formatted in SEO friendly HTML.
        The response must also include appropriate HTML title and meta description content.
        The return format must be stringified JSON in the following format:
        {
            "postContent": post content here
            "title": title goes here
            "metaDescription": meta description here
        }`,
    });

    console.log("response", response);
    res.status(200).json({ post: JSON.parse(response.data.choices[0]?.text.split("\n").join("")) })
  }
  