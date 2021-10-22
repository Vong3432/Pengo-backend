import { BankAccountType } from "App/Models/BankAccount";
import Penger from "App/Models/Penger";
import Stripe from "stripe";
import BankAccountService from "../payment/BankAccountService";
import StripeCustomerService from "../payment/StripeCustomerService";

class PengerService {
    async findById(id: number) {
        try {
            const penger = await Penger.findByOrFail('id', id)
            return penger;
        } catch (error) {
            throw "Something went wrong"
        }
    }

    async setupBankAccount(self: Penger) {
        // const trx = await DBTransactionService.init();
        try {

            // store "customer" object from Stripe.
            let fromCus: Stripe.Customer | Stripe.DeletedCustomer
            await self.load('bankAccounts');

            // check if current penger has any bank accounts in DB
            if (self.bankAccounts.length === 0) {
                // does not has any record, create a new one
                fromCus = await StripeCustomerService.create({ description: self.name });
                await BankAccountService.create(fromCus.id, BankAccountType.PENGER, self.id);
            } else {
                // does has record, return it from db
                fromCus = await StripeCustomerService.retrieve(self.bankAccounts[0].uniqueId);
            }

            // refresh
            await self.load('bankAccounts');
            return self.bankAccounts[0];

        } catch (error) {
            // await trx.rollback()
            throw error
        }
    }

    // async payout(amount: number, to: number, self: Penger) {
    //     const trx = await DBTransactionService.init();
    //     try {

    //         // store "customer" object from Stripe.
    //         let fromCus: Stripe.Customer | Stripe.DeletedCustomer
    //         await self.load('bankAccounts');

    //         // check if current penger has any bank accounts in DB
    //         if (self.bankAccounts.length === 0) {
    //             // does not has any record, create a new one
    //             fromCus = await StripeCustomerService.create({ description: self.name });
    //             await BankAccountService.create(fromCus.id, BankAccountType.PENGER, self.id);
    //         } else {
    //             // does has record, return it from db
    //             fromCus = await StripeCustomerService.retrieve(self.bankAccounts[0].uniqueId);
    //         }

    //         // refresh
    //         await self.load('bankAccounts');

    //         // find bank account of a pengoo (from: "to")
    //         const toPengooAccounts = await BankAccountService.findAccounts(to, BankAccountType.PENGER);
    //         // throw err if that pengoo does not have bank acc
    //         if (!toPengooAccounts || toPengooAccounts.length === 0) throw "No account";

    //         // Deposit money
    //         const paymentIntent = await StripePaymentService.deposit(fromCus.id, amount)

    //         // Create custom record and save into transaction table. 
    //         const transaction = new Transaction()
    //         transaction.fill({
    //             toBankAccountId: toPengooAccounts[0].id,
    //             bankAccountId: self.bankAccounts[0].id,
    //             amount: amount,
    //             metadata: JSON.stringify(paymentIntent),
    //         })

    //         await self.bankAccounts[0].useTransaction(trx).related('transactions').save(transaction);
    //         await trx.commit()

    //         return paymentIntent;

    //     } catch (error) {
    //         await trx.rollback()
    //         throw error
    //     }
    // }
}

export default new PengerService();
