'use client';

import { PAYPAL_CONFIG_OPTIONS } from '@/constants';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

interface Props {
  children: React.ReactNode;
}

const PayPalProvider = ({ children }: Props) => {
  return (
    <PayPalScriptProvider options={PAYPAL_CONFIG_OPTIONS}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
