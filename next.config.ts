import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aranyakresortghatsila.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const developmentScriptPolicy = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';
    const productionOnly = process.env.NODE_ENV === 'production' ? ' upgrade-insecure-requests;' : '';
    const contentSecurityPolicy = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${developmentScriptPolicy} https://checkout.razorpay.com https://api.razorpay.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://aranyakresortghatsila.com",
      "font-src 'self' data:",
      "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
      "frame-src 'self' https://www.google.com https://maps.google.com https://checkout.razorpay.com https://api.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.razorpay.com https://checkout.razorpay.com",
      "frame-ancestors 'none'",
      productionOnly,
    ].join(';');

    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'X-Frame-Options', value: 'DENY' },
        ...(process.env.NODE_ENV === 'production' ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }] : []),
      ],
    }];
  },
};

export default nextConfig;
