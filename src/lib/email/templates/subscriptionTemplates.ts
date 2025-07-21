export const getSubscriptionPurchasedEmail = ({
  userName = 'User',
  planName,
  price,
  startDate,
  nextBillingDate
}: {
  userName?: string;
  planName: string;
  price: string;
  startDate: string;
  nextBillingDate: string;
}) => {
  const content = `
    <div class="heading">
      <h1>Subscription Activated</h1>
    </div>
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Thank you for choosing the <strong>${planName} Plan</strong>! Here are your subscription details:</p>
    <div class="plan-card">
      <h2>${planName} Plan</h2>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Started On:</strong> ${startDate}</p>
      <p><strong>Next Billing Date:</strong> ${nextBillingDate}</p>
    </div>
    <p>We’re excited to have you on board. Enjoy all the benefits and features included in your plan.</p>
    <div class="support-note">
      Need help? Our support team is always ready to assist you.
    </div>
  `;

  const extraStyles = `
    .heading h1 {
      text-align: center;
      padding: 10px;
    }
    .plan-card {
      background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0;
    }
    .plan-card h2 { font-size: 18px; margin: 0 0 10px; color: #0f172a; }
    .plan-card p { margin: 4px 0; font-size: 15px; color: #334155; }
    .highlight { color: #1890ff; font-weight: 600; }
    .support-note {
      background: #f8fafc; padding: 16px; border-radius: 6px;
      font-size: 13px; color: #475569; margin-top: 30px;
    }
  `;

  return {
    subject: `Your ${planName} Subscription is Active`,
    html: content,
    extraStyles
  };
};

export const getSubscriptionCancelledEmail = ({
  userName = 'User',
  planName,
  price,
  startDate,
  nextBillingDate,
  cancelImmediately = false
}: {
  userName?: string;
  planName: string;
  price: string;
  startDate: string;
  nextBillingDate: string;
  cancelImmediately?: boolean;
}) => {
  const accessInfo = cancelImmediately
    ? `<p>Your plan has been cancelled <strong>immediately</strong> because you switched to a different subscription.</p>`
    : `<p>You’ll continue to have access to your plan until <strong>${nextBillingDate}</strong>.</p>`;

  const content = `
    <div class="heading">
      <h1>Subscription Cancelled</h1>
    </div>

    <p>Hi <span class="highlight">${userName}</span>,</p>

    <p>We’re sorry to see you go. Your <strong>${planName} Plan</strong> subscription has been cancelled.</p>

    <div class="plan-card">
      <h2>${planName} Plan</h2>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Started On:</strong> ${startDate}</p>
      ${cancelImmediately ? '' : `<p><strong>Access Until:</strong> ${nextBillingDate}</p>`}
    </div>

    ${accessInfo}

    <div class="support-note">
      Need help? Our support team is always ready to assist you.
    </div>
  `;

  const extraStyles = `
    .heading h1 {
      text-align: center;
      padding: 10px;
    }
    .plan-card {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .plan-card h2 {
      font-size: 18px;
      margin: 0 0 10px;
      color: #0f172a;
    }
    .plan-card p {
      margin: 4px 0;
      font-size: 15px;
      color: #334155;
    }
    .highlight {
      color: #1890ff;
      font-weight: 600;
    }
    .support-note {
      background: #f8fafc;
      padding: 16px;
      border-radius: 6px;
      font-size: 13px;
      color: #475569;
      margin-top: 30px;
    }
  `;

  return {
    subject: `Your ${planName} Subscription has been Cancelled`,
    html: content,
    extraStyles
  };
};
