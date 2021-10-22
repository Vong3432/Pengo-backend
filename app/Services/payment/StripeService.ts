import StripeInterface from "Contracts/interfaces/Stripe.interface"
import Env from '@ioc:Adonis/Core/Env'
import Stripe from "stripe";
import StripeCustomerService from "./StripeCustomerService";

class StripeService implements StripeInterface {
    private SK: string;
    private PK: string;
    private stripe: Stripe;

    constructor() {
        this.SK = Env.get("STRIPE_SK");
        this.PK = Env.get("STRIPE_PK");
        this.stripe = new Stripe(this.SK, {
            apiVersion: "2020-08-27",
        });
    }

    public getStripe(): Stripe {
        return this.stripe;
    }

}

export default new StripeService()