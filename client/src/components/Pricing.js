import React from 'react';

function Pricing() {
  return (
    <div className="detail-container" role="region" aria-label="Pricing Plans">
      <h2>Pricing Plans</h2>
      <p>Subscribe to unlock premium features:</p>
      <ul>
        <li>Basic: $5/month - 5 portfolio items</li>
        <li>Pro: $15/month - Unlimited items, analytics</li>
      </ul>
      <p><a href="mailto:info@artify.com?subject=Subscription Inquiry" aria-label="Contact for subscription">Contact us</a> to subscribe!</p>
    </div>
  );
}

export default Pricing;.