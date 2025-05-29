import { verificationEmailHtml } from '@/utils/verificationEmail';
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string | undefined , token: string | undefined) => {

    if (!email || !token) return;

    const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/newVerification?token=${token}`;
    const htmlContent = verificationEmailHtml(verifyUrl)

    // const transporter = nodemailer.createTransport({
    //     service: 'SendGrid',
    //     auth: {
    //         user: 'apikey',
    //         pass: process.env.SENDGRID_API_KEY,
    //     },
    // })

    // const sendMail = await transporter.sendMail({
    //     from: process.env.SENDGRID_FROM_EMAIL,
    //     to: email,
    //     subject: 'Verify your email',
    //     html: htmlContent,
    // })

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    })

    console.log("SMTP USER:", process.env.GMAIL_USER);
    console.log("Pass:", process.env.GMAIL_APP_PASSWORD);


    try {
        const info = await transporter.sendMail({
        from: `"Auth App" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        html: htmlContent,
        });

        console.log("Email sent:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error sending verification email:", err);
    }

}

