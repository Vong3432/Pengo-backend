import Stripe from "stripe";

export default interface StripeCustomerInterface {
    create(param: Stripe.CustomerCreateParams): Promise<any>
    retrieve(id: string): Promise<any>
    update(id: string, param: Stripe.CustomerUpdateParams): Promise<any>
    delete(id: string): Promise<any>
    listAll(param: Stripe.CustomerListParams): Promise<any>
}