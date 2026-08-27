import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ isPro: false, error: 'Chybí e-mail' }, { status: 400 });
    }

    // 1. Vyhledá zákazníka ve Stripe podle e-mailu
    const customers = await stripe.customers.list({
      email: email.trim().toLowerCase(),
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ isPro: false, message: 'Zákazník nenalezen' });
    }

    const customerId = customers.data[0].id;

    // 2. Ověří, zda má aktivní předplatné nebo běžící trial
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ isPro: false, message: 'Žádné předplatné' });
    }

    const sub = subscriptions.data[0];
    const isValid = sub.status === 'active' || sub.status === 'trialing';

    return NextResponse.json({
      isPro: isValid,
      status: sub.status, // 'active', 'trialing', 'canceled', 'past_due'
      trialEnd: sub.trial_end,
    });
  } catch (error: any) {
    console.error('Chyba ověření Stripe:', error);
    return NextResponse.json({ isPro: false, error: 'Chyba serveru' }, { status: 500 });
  }
}
