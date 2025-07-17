import juice from 'juice';
import { sgMail as sendGridMail, fromEmail } from './config';
import { emailLayout } from '@/lib/email/templates/emailLayout';

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  extraStyles?: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
  extraStyles = ''
}: SendEmailParams) => {
  try {
    const htmlWithLayout = emailLayout(html, extraStyles);
    const inlinedHtml = juice(htmlWithLayout);

    const msg = {
      to,
      from: fromEmail,
      subject,
      html: inlinedHtml
    };

    await sendGridMail.send(msg);

    return { success: true };
  } catch (error: any) {
    console.error('Error in sendEmail:', error?.response?.body || error);
    return { success: false, error };
  }
};
