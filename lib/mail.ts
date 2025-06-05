import { passwordResetEmailHtml, twoFactorEmailTemplate, verificationEmailHtml } from '@/utils/verificationEmail';
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string | undefined , token: string | undefined) => {

    if (!email || !token) return;

    const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/newVerification?token=${token}`;
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

export const sendPasswordResetEmail = async (email: string | undefined, token: string | undefined) => {
    if (!email || !token) return;

    const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/pass-reset?token=${token}`;
    const htmlContent = passwordResetEmailHtml(resetUrl);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Auth App" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Reset your password",
            html: htmlContent,
        });

        console.log("Password reset email sent:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error sending password reset email:", err);
    }
}

export const sendTwoFactorEmail = async (email: string | undefined, token: string | undefined) => {
    if (!email || !token) return;

    const htmlContent = twoFactorEmailTemplate(token);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Auth App@verify 2fa" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "2FA Verification",
            html: htmlContent,
        });

        console.log("Password reset email sent:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error sending password reset email:", err);
    }

}

