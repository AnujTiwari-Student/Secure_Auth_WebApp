import { NextRequest, NextResponse } from 'next/server';
import admin from '../../../firebase/firebaseAdmin';

export async function POST(req: NextRequest){

    const { token, title, body } = await req.json();

    if(!token){
        return NextResponse.json({message: "Token is required"}, {status: 400});
    }

    const message = {
        token,
        notification: {
            title: title || "Notification",
            body: body || "This is a notification",
        }
    }

    try {
        const response = await admin.messaging().send(message);
        return NextResponse.json({ success: true, response });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}   

