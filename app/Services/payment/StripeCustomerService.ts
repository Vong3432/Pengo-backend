import StripeCustomerInterface from "Contracts/interfaces/StripeCustomer.interface"
import Stripe from "stripe";
import StripeService from "./StripeService";

class StripeCustomerService implements StripeCustomerInterface {
    private stripeClient: Stripe;

    constructor() {
        this.stripeClient = StripeService.getStripe()
    }

    async create(param: Stripe.CustomerCreateParams) {
        return await this.stripeClient.customers.create(param)
    }
    async retrieve(id: string) {
        return await this.stripeClient.customers.retrieve(id)
    }
    async update(id: string, param: Stripe.CustomerUpdateParams) {
        return await this.stripeClient.customers.update(id, param)
    }
    async delete(id: string) {
        return await this.stripeClient.customers.del(id)
    }
    async listAll(param: Stripe.CustomerListParams) {
        return await this.stripeClient.customers.list(param);
    }

}

export default new StripeCustomerService()