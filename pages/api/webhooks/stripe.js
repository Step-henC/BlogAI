import Cors from 'micro-cors'; //instructor installed opens up endpoint for external extentities to call it
import stripeInit from 'stripe';
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
    allowMethods: ["POST", "HEAD"]
});

export const config = { //built in nextjs feature that nextjs will apply these settings
    //by default nextjs parses any data passed into an endpoint so we will turn this parsing off to get raw data

    api: {
        bodyParser: false
    }

}


const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STIPE_WEBHOOK_SECRET;
const handler = async (req, res) => {

        if (req.method === 'POST') {
            //verify data posted is from stripe
            let resolution; //have to name it anything but event even though stripe calls them event objects
            try {
             resolution = await verifyStripe({
                req,
                stripe,
                endpointSecret
            });

        }catch(e) {
            console.log(e)
        }
        switch(resolution.type) {
            case 'payment_intent.succeeded': {


    const client = await clientPromise; // lieves in lib -> mongoDb.js 
    const db = client.db('BlogStandard');

    const paymentIntent = resolution.data.object;
    const auth0Id = paymentIntent.metadata.sub;

    const userProfile = await db.collection('users').updateOne({
        auth0Id: auth0Id //mongo will create one if not existent or upsert
    }, {
        $inc: {
            availableTokens: 10 //dollar sign inc tells mongoDb to increment by 10 in our case
        },
        $setOnInsert: {
            auth0Id: auth0Id // if user does not exist then set this property
        }
    }, {
        upsert: true //yeah
    })    
                
            }
            default:
                console.log("UNHANDLED EVENT: ", resolution.type)
        }
       res.status(200).json({received: true})

        } 
           
        
        
    }

    export default cors(handler);


