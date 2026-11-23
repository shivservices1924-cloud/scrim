// RushX Payment Gateway Integration Layer
// Ready for Razorpay, Cashfree, Paytm, PhonePe PG or Custom UPI Gateway Webhooks

import crypto from 'crypto';
import { db } from './db.js';

export const PaymentGateway = {
  /**
   * Create an order with payment gateway (e.g. Razorpay / Cashfree)
   * When user enters amount and clicks "Pay via Gateway"
   */
  async createOrder({ userId, username, amount }) {
    const numAmount = Math.round(Number(amount));
    if (!Number.isFinite(numAmount) || numAmount < 50 || numAmount > 500) {
      throw new Error('Deposit amount must be between ₹50 and ₹500');
    }

    const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    return {
      orderId,
      amount: numAmount,
      currency: 'INR',
      status: 'CREATED',
      gateway: 'MANUAL_UPI_OR_GATEWAY',
      note: 'Payment gateway order created. Ready for Razorpay / Cashfree SDK connection.'
    };
  },

  /**
   * Handle Webhook from Payment Gateway (Instant auto-deposit confirmation)
   * Protected against spoofing, forgery, replay attacks & invalid amounts!
   */
  async handleWebhook(eventData, reqHeaders = {}) {
    if (!eventData || typeof eventData !== 'object') {
      throw new Error('Invalid webhook payload format');
    }

    const configuredSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET;
    const incomingSignature =
      reqHeaders['x-webhook-secret'] ||
      reqHeaders['x-razorpay-signature'] ||
      reqHeaders['x-gateway-signature'];

    // Strict Security Rule: Reject unauthenticated webhook invocations
    if (!configuredSecret) {
      // If no webhook secret is set in environment, webhooks are disabled by default
      // to prevent zero-day free money exploits
      throw new Error('Payment webhook endpoint is currently disabled. Configure PAYMENT_WEBHOOK_SECRET to enable.');
    }

    if (!incomingSignature) {
      throw new Error('Unauthorized webhook: missing security signature header.');
    }

    const isMatch =
      incomingSignature === configuredSecret ||
      (incomingSignature.length === configuredSecret.length &&
        crypto.timingSafeEqual(Buffer.from(incomingSignature), Buffer.from(configuredSecret)));

    if (!isMatch) {
      throw new Error('Unauthorized webhook: invalid security signature.');
    }

    const { userId, amount, orderId, gatewayTxnId, status } = eventData;

    if (status === 'SUCCESS' || status === 'CHARGED') {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user identifier in webhook event');
      }

      const user = await db.findUserByIdAsync(userId);
      if (!user) throw new Error('User not found for webhook event');
      if (user.isBanned) throw new Error('User account is suspended');

      const numAmount = Math.round(Number(amount));
      if (!Number.isFinite(numAmount) || numAmount < 50 || numAmount > 500) {
        throw new Error('Invalid deposit amount in webhook: must be between ₹50 and ₹500');
      }

      // Replay Attack Prevention: check if this orderId or txnId has already been credited
      const cleanRef = String(orderId || gatewayTxnId || '').trim();
      if (cleanRef) {
        const isDuplicate = (db.data.transactions || []).some(
          t => t.description && t.description.includes(cleanRef)
        );
        if (isDuplicate) {
          return { success: true, duplicate: true, message: 'Transaction already processed.' };
        }
      }

      const newDepositBal = (Number(user.depositBalance) || 0) + numAmount;
      await db.updateUser(user.id, { depositBalance: newDepositBal });

      const now = new Date();
      const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      // Create transaction
      await db.createTransaction({
        id: 'tx_' + Date.now(),
        userId: user.id,
        type: 'credit',
        walletType: 'deposit',
        amount: numAmount,
        newBalance: newDepositBal + (Number(user.winBalance) || 0),
        date: dateFormatted,
        txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
        description: `Gateway Auto-Deposit Verified (Order: ${orderId || 'Direct'}, Ref: ${gatewayTxnId || cleanRef || 'PG_SUCCESS'})`,
        createdAt: now.toISOString()
      });

      return { success: true, newBalance: newDepositBal };
    }

    return { success: false, status };
  }
};
