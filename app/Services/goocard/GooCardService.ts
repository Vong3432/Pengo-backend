
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import GoocardNotVerifiedException from "App/Exceptions/GoocardNotVerifiedException";
import UnAuthorizedException from "App/Exceptions/UnAuthorizedException";
import { BankAccountType } from "App/Models/BankAccount";
import GooCard from "App/Models/GooCard";
import GoocardInterface from "Contracts/interfaces/Goocard.interface";
import Stripe from "stripe";
import { DBTransactionService } from "../db/DBTransactionService";
import BankAccountService from "../payment/BankAccountService";
import StripeCustomerService from "../payment/StripeCustomerService";
import StripePaymentService from "../payment/StripePaymentService";

class GooCardService implements GoocardInterface {
    async create(pin: string): Promise<GooCard> {
        const card = new GooCard();
        const trx = await DBTransactionService.init();
        try {
            await card.useTransaction(trx).fill({ pin }).save();
            await trx.commit();
            return card;
        } catch (error) {
            await trx.rollback();
            throw "Something went wrong"
        }
    }
    async verify(pin: string, userId: number) {
        try {
            const goocard = await GooCard.query()
                .where('pin', pin)
                .where('user_id', userId)
                .firstOrFail();
            return goocard;
        } catch (error) {
            throw new GoocardNotVerifiedException("Not authorized to this card.");
        }
    }

    /**
     * 
     * 
     * @param amount - Min RM 2, using cents as unit. Eg RM 2.00 => 200 cents.
     * @param to - The penger id that is gonna get payment.
     * @param auth - Current login user interface.
     * @returns 
     */
    async pay(amount: number, to: number, auth: AuthContract) {
        try {
            const user = await auth.authenticate()

            if (!auth.isLoggedIn) throw new UnAuthorizedException("Not logged in");

            // store "customer" object from Stripe.
            let fromCus: Stripe.Customer | Stripe.DeletedCustomer

            await user.load('goocard', q => q.preload('bankAccounts'));

            // check if current goocard has any bank accounts in DB
            if (user.goocard.bankAccounts.length === 0) {
                // does not has any record, create a new one
                fromCus = await StripeCustomerService.create({ description: user.username });
                await BankAccountService.create(fromCus.id, BankAccountType.GOOCARD, user.goocard.id);
            } else {
                // does has record, return it from db
                fromCus = await StripeCustomerService.retrieve(user.goocard.bankAccounts[0].uniqueId);
            }

            // refresh
            await user.goocard.load('bankAccounts');

            // find bank account of a penger (from: "to")
            const toPengerBankAcc = await BankAccountService.findAccounts(to, BankAccountType.PENGER);
            // throw err if that penger does not have bank acc
            if (!toPengerBankAcc || toPengerBankAcc.length === 0) throw "No account";

            // Deposit money
            const paymentIntent = await StripePaymentService.deposit(fromCus.id, amount)

            return {
                ...paymentIntent,
                bank_account_id: user.goocard.bankAccounts[0].id,
                to_bank_account_id: toPengerBankAcc[0].id,
                amount: amount,
                metadata: JSON.stringify(paymentIntent)
            };

        } catch (error) {
            throw error
        }
    }
}

export default new GooCardService();
