// utils/emailTemplates.ts

export const verificationEmailHtml = (verifyUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #2c3e50;">Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>Thank you for registering with <strong>Anuj Tiwari</strong>'s platform. To complete your registration and start using all features, please verify your email address by clicking the link below:</p>
      
      <p style="margin: 20px 0;">
        <a href="${verifyUrl}" style="background-color: #10b981; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Verify My Email</a>
      </p>
      
      <p>If the button above doesn't work, you can copy and paste the following URL into your browser:</p>
      <p style="word-break: break-all;"><a href="${verifyUrl}">${verifyUrl}</a></p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

      <p style="font-size: 14px; color: #555;">
        If you didn’t request this email, you can safely ignore it. This verification link will expire in 1 hour.
      </p>
      <p style="font-size: 14px; color: #555;">
        Need help? Contact us at <a href="mailto:support@anujtiwari.dev">support@anujtiwari.dev</a>
      </p>

      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        Sent by Anuj Tiwari • <a href="https://anujtiwari.dev" style="color: #999;">anujtiwari.dev</a><br/>
        You are receiving this email because you recently created an account.
      </p>
    </div>
  `
}
