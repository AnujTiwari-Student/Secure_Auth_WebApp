import { ResetPasswordToken } from './../node_modules/.prisma/client/index.d';
import { getVerificationTokenByEmail } from '@/data/verificationToken'
import { SignJWT, jwtVerify, importJWK } from 'jose'
import { prisma } from "../lib/prisma"
import { sendVerificationEmail } from './mail'
import { getResetPassTokenByEmail } from '@/data/resetPassToken'
import crypto from 'crypto'
import { getTwoFactorTokenByEmail } from '@/data/twoFactorToken';

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

        return verificationToken;

    } catch (error) {
        console.error("Error generating verification token:", error);
        return null;
    }
}

export const generatePasswordResetToken = async (email: string) => {

     if (!privateJwk || !publicJwk) {
        throw new Error("JWT keys are not defined in the environment variables.");
    }

    if (!email) {
        throw new Error("Email is required to generate a verification token.");
    }

    try {
        const existingToken = await getResetPassTokenByEmail(email);

        if (existingToken) {
            await prisma.resetPasswordToken.delete({
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

        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        const resetPassToken = await prisma.resetPasswordToken.create({
            data: {
                token,
                email,
                expires
            },
        })

        return {
            token: resetPassToken.token,
            expires: resetPassToken.expires,
            email: resetPassToken.email,
            identifier: resetPassToken.identifier
        }
         
    } catch (error) {
        console.error("Error generating reset password token:", error);
        return null;
    }

}

export const generateTwoFactorToken = async (email: string) => {

    const token = crypto.randomInt(100000, 999999).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000); 

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await prisma.twoFactorToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            token,
            email,
            expires
        },
    })

    return twoFactorToken

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