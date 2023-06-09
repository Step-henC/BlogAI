//we connect to mongo db here

import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from '../../lib/mongodb';
import stripeInit from 'stripe'; //could call it stripeAnything if we want

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

    //check if user has profile. 

    const { user } = await getSession(req, res); // gets user infor from auth0 Must add await async because it returns a promise
    // we need the 'sub' value from the auth0 user


    //url in checkout session is specific to protocol. 
    //need to do determine if localhost dev environment (http) vs prod env (httpS)
    //also check which domain name add tokens was checked from

    const protocol = process.env.NODE_ENV === 'development' ? "http://" : "https://";

    const host = req.headers.host; // in local env this is just localhost:3000

    const lineItems = [{
        price: process.env.STRIPE_PRODUCT_PRICE_ID, //10 tokens for $9 set at stripe.com -> products
        quantity: 1
    }]

    const checkOutSession = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${protocol}${host}/success`,
        payment_intent_data: {
            metadata: {
                sub: user.sub
            }
        },
        metadata: {
            sub: user.sub
        }

    })

    //if not create one

    //if so then add tokens


    res.status(200).json({session: checkOutSession})
}