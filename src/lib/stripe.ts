import Stripe from 'stripe';

// Initialize Stripe. Defaults to a placeholder to prevent build errors if env var is missing.
// Runtime operations will fail if the key is invalid.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    // apiVersion: '2024-12-18.acacia', // Let it use default or pinned version
    typescript: true,
});
