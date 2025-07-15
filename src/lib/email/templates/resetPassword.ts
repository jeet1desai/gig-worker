type TemplateOptions = {
  userName?: string;
  actionLink: string;
};

export const getResetPasswordEmail = ({ userName = 'User', actionLink }: TemplateOptions) => {
  const content = `
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>

    <p>Hello ${userName},</p>

    <p>You requested to reset your password. Click the button below to set a new password:</p>

    <div class="btn-container">
      <a href="${actionLink}" class="btn" target="_blank" rel="noopener noreferrer">Reset Password</a>
    </div>

    <p>If you did not request a password reset, you can safely ignore this email.</p>
  `;

  return {
    subject: 'Reset Your Password',
    html: content
  };
};
