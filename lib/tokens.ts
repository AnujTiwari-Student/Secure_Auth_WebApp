import { getVerificationTokenByEmail } from '@/data/verificationToken'
import { SignJWT, jwtVerify, importJWK } from 'jose'
import { prisma } from "../lib/prisma"
import { sendVerificationEmail } from './mail'

const ALGORITHM = 'RS256'

const privateJwk = JSON.parse(process.env.JWT_PRIVATE_KEY!)
const publicJwk = JSON.parse(process.env.JWT_PUBLIC_KEY!)

export const generateVerificationToken = async (email: string) => {

    if (!privateJwk || !publicJwk) {
        throw new Error("JWT keys are not defined in the environment variables.");
    }

    if (!email) {
        throw new Error("Email is required to generate a verification token.");
    }

    try {

        const existingToken = await getVerificationTokenByEmail(email);

        if (existingToken) {
            console.warn("A verification token already exists for this email. It will be replaced.");
            await prisma.verificationToken.delete({
                where: {
                    identifier: existingToken.identifier,
                },
            });
        }

        const privateKey = await importJWK(privateJwk, ALGORITHM)

        const token = await new SignJWT({email})
            .setProtectedHeader({ alg: ALGORITHM })
            .setIssuedAt()
            .setExpirationTime('1h') 
            .sign(privateKey)

        console.log("Generated verification token:", token);

        const expires = new Date(Date.now() + 60 * 60 * 1000);

        const verificationToken = await prisma.verificationToken.create({
            data: {
                email,
                token,
                expires,
            },
        })

        await sendVerificationEmail(email, token);
        console.log("Verification email sent to:", email);

        return verificationToken;

    } catch (error) {
        console.error("Error generating verification token:", error);
        return null;
    }
}

export const verifyVerificationToken = async (token: string) => {
    try {
        const publicKey = await importJWK(publicJwk, ALGORITHM)

        const { payload } = await jwtVerify(token, publicKey , {
            algorithms: [ALGORITHM],
        })

        return payload

    } catch (error) {
        console.error("Error verifying verification token:", error);
        return null;
    }
}