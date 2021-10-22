import StripeInterface from "Contracts/interfaces/Stripe.interface"
import StripeCustomerService from "./StripeCustomerService";
import StripeService from "./StripeService";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import PaymentInterface from "Contracts/interfaces/Payment.interface";

class StripePaymentService implements StripeInterface, PaymentInterface {
    async withdraw(from: string, to: string, amount: number, extra?: {}): Promise<any> {

        const fromCus = await StripeCustomerService.retrieve(from);
        const toCus = await StripeCustomerService.retrieve(to);
    }

    async deposit(cusId, amount: number, extra?: { auth: AuthContract }): Promise<any> {
        try {
            const paymentIntent = await StripeService.getStripe().paymentIntents.create({
                amount: amount,
                currency: 'myr',
                payment_method_types: ['card'],
                customer: cusId,
            });

            return paymentIntent;
            // const fromCus = await StripeCustomerService.retrieve(from);
            // const toCus = await StripeCustomerService.retrieve(to);

            // const account = await this.stripe.accounts.create({
            //     type: 'custom',
            //     country: 'US',
            //     email: 'jenny.rosen@example.com',
            //     capabilities: {
            //         card_payments: { requested: true },
            //         transfers: { requested: true },
            //     },
            // });

            // const accountLinks = await this.stripe.accountLinks.create({
            //     account: account.id,
            //     refresh_url: 'https://example.com/reauth',
            //     return_url: 'https://example.com/return',
            //     type: 'account_onboarding',
            // });

            // const session = await this.stripe.checkout.sessions.create({
            //     payment_method_types: ['card'],
            //     line_items: [{
            //       name: 'Stainless Steel Water Bottle',
            //       amount: 1000,
            //       currency: 'myr',
            //       quantity: 1,
            //     }],
            //     payment_intent_data: {
            //       application_fee_amount: 123,
            //     },
            //     mode: 'payment',
            //     success_url: 'https://example.com/success',
            //     cancel_url: 'https://example.com/cancel',
            //   }, {
            //     stripeAccount: '{{CONNECTED_STRIPE_ACCOUNT_ID}}',
            //   });

            // return accountLinks.url
        } catch (error) {
            throw error;
        }
    }

}

export default new StripePaymentService()