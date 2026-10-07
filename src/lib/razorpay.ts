import Razorpay from 'razorpay';

// Lazy initialization — avoids crashing at build time when env vars aren't set
let _razorpay: InstanceType<typeof Razorpay> | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not set in environment variables');
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

// Keep backward compatibility for imports
export const razorpay = new Proxy({} as Razorpay, {
  get(_, prop) {
    return (getRazorpayInstance() as any)[prop];
  }
});

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
