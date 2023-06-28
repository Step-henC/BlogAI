//we connect to mongo db here

import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {

    //check if user has profile. 

    const { user } = await getSession(req, res); // gets user infor from auth0 Must add await async because it returns a promise
    // we need the 'sub' value from the auth0 user

    const client = await clientPromise; // lieves in lib -> mongoDb.js 
    const db = client.db('BlogStandard');

    const userProfile = await db.collection('users').updateOne({
        auth0Id: user.sub //mongo will create one if not existent or upsert
    }, {
        $inc: {
            availableTokens: 10 //dollar sign inc tells mongoDb to increment by 10 in our case
        },
        $setOnInsert: {
            auth0Id: user.sub // if user does not exist then set this property
        }
    }, {
        upsert: true //yeah
    })


    //if not create one

    //if so then add tokens



    res.status(200).json({name: 'John Doe'})
}