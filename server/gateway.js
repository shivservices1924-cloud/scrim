// RushX Payment Gateway Integration Layer
// Ready for Razorpay, Cashfree, Paytm, PhonePe PG or Custom UPI Gateway Webhooks

import { db } from './db.js';

export const PaymentGateway = {
  /**
   * Create an order with payment gateway (e.g. Razorpay / Cashfree)
   * When user enters amount and clicks "Pay via Gateway"
   */
  async createOrder({ userId, username, amount }) {
    const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // In production with Razorpay SDK:
    // const rzpOrder = await razorpay.orders.create({ amount: amount * 100, currency: "INR", receipt: orderId });
    // return { orderId: rzpOrder.id, amount, key: process.env.RAZORPAY_KEY_ID };

    return {
      orderId,
      amount,
      currency: 'INR',
      status: 'CREATED',
      gateway: 'MANUAL_UPI_OR_GATEWAY',
      note: 'Payment gateway order created. Ready for Razorpay / Cashfree SDK connection.'
    };
  },

  /**
   * Handle Webhook from Payment Gateway (Instant auto-deposit confirmation)
   */
  async handleWebhook(eventData) {
    const { userId, amount, orderId, gatewayTxnId, status } = eventData;

    if (status === 'SUCCESS' || status === 'CHARGED') {
      const user = db.getUserById(userId);
      if (!user) throw new Error('User not found for webhook event');

      const numAmount = Number(amount);
      const newDepositBal = (Number(user.depositBalance) || 0) + numAmount;
      db.updateUser(user.id, { depositBalance: newDepositBal });

      const now = new Date();
      const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      // Create transaction
      db.createTransaction({
        id: 'tx_' + Date.now(),
        userId: user.id,
        type: 'credit',
        walletType: 'deposit',
        amount: numAmount,
        newBalance: newDepositBal + (Number(user.winBalance) || 0),
        date: dateFormatted,
        txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
        description: `Gateway Auto-Deposit Verified (Order: ${orderId}, Ref: ${gatewayTxnId || 'PG_SUCCESS'})`,
        createdAt: now.toISOString()
      });

      return { success: true, newBalance: newDepositBal };
    }

    return { success: false, status };
  }
};
