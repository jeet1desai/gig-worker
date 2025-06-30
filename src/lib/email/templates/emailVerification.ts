type TemplateOptions = {
  userName?: string;
  actionLink: string;
};

export const getVerificationEmail = ({ userName = 'User', actionLink }: TemplateOptions) => {
  const content = `
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>

    <p>Hello ${userName},</p>

    <p>We are excited to have you get started! First, you need to verify your email address by clicking the button below.</p>

    <div class="btn-container">
      <a href="${actionLink}" class="btn" target="_blank" rel="noopener noreferrer">Verify Email</a>
    </div>

    <p>If you didn't create an account, you can safely ignore this email.</p>
  `;

  return {
    subject: 'Verify Your Email Address',
    html: content,
  };
}
