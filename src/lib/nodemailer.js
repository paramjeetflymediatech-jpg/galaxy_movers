import nodemailer from 'nodemailer';

// Create transporter using environment variables or a secure fallback configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587 or 2525
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    rejectUnauthorized: false // avoids SSL verification issues on local/testing smtp
  }
});

/**
 * Sends an email notification to the administrator.
 * Handles missing credentials or failures gracefully to ensure form submissions do not fail.
 * 
 * @param {string} subject - The subject line of the email.
 * @param {string} htmlContent - The HTML content body of the email.
 * @returns {Promise<object>} - Details about the mail transport transaction.
 */
export async function sendAdminNotificationEmail(subject, htmlContent) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@galaxymovers.ca';

  // If SMTP user is not defined, mock the email submission in the console
  if (!process.env.SMTP_USER) {
    console.warn('[Nodemailer Mock Alert]: SMTP credentials are not configured in .env. Logging email structure instead:');
    console.log('========================================================================');
    console.log(`TO:      ${adminEmail}`);
    console.log(`SUBJECT: ${subject}`);
    console.log('------------------------------------------------------------------------');
    console.log(htmlContent.replace(/<[^>]*>/g, '\n').replace(/\n\s*\n/g, '\n').trim());
    console.log('========================================================================');
    return { mock: true, message: 'SMTP credentials missing, printed to terminal log.' };
  }

  const mailOptions = {
    from: `"Galaxy Movers Alerts" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer Notification] Sent email successfully. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Nodemailer Error] Failed to send email:', error);
    return { success: false, error: error.message };
  }
}
