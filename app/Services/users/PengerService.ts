import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import BankAccount, { BankAccountType } from "App/Models/BankAccount";
import Penger from "App/Models/Penger";
import BankAccountService from "../payment/BankAccountService";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role, { Roles } from "App/Models/Role";
import { PengerVerifyAuthorizationService } from "../PengerVerifyAuthorizationService";
import Transaction from "App/Models/Transaction";
import { DBTransactionService } from "../db/DBTransactionService";
import StripeService from "../payment/StripeService";
import SettingService from "../admin/SettingService";

class PengerService {
    async findTotalStaff({ request, bouncer }: HttpContextContract) {
        try {
            const { penger_id } = request.qs()
            const staffRole = await Role.findByOrFail('name', Roles.Staff)

            const penger = await Penger.query()
                .withCount('pengerUsers', q => q.where('role_id', staffRole.id).as('totalStaff'))
                .where('id', penger_id)
                .firstOrFail()
            await PengerVerifyAuthorizationService.isPenger(bouncer);
            await PengerVerifyAuthorizationService.isRelated(bouncer, penger);

            return penger.$extras.totalStaff
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number) {
        try {
            const penger = await Penger.findByOrFail('id', id)
            await penger.load('location')
            return penger;
        } catch (error) {
            throw "Something went wrong"
        }
    }

    async findAll(auth: AuthContract) {
        const user = await auth.authenticate()
        await user.load('pengerUsers', q => q.preload('location'))
        return user.pengerUsers
    }

    async setupBankAccount(accId: string, self: Penger) {
        // const trx = await DBTransactionService.init();
        try {

            await self.load('bankAccounts');

            // check if current penger has any bank accounts in DB
            if (self.bankAccounts.length === 0) {
                // does not has any record, create a new one
                // fromCus = await StripeCustomerService.create({ description: self.name });
                await BankAccountService.create(accId, BankAccountType.PENGER, self.id);
            } else {
                // does has record, return it from db
                return await this.updateBankAccount(accId, self)
            }

            // refresh
            await self.load('bankAccounts');
            return self.bankAccounts[0];

        } catch (error) {
            // await trx.rollback()
            throw error
        }
    }

    async updateBankAccount(accId: string, self: Penger) {
        try {

            const bankAccount = await BankAccount.query()
                .where('type', BankAccountType.PENGER)
                .where('holder_id', self.id)
                .firstOrFail()

            await bankAccount.merge({ uniqueId: accId }).save()
            // refresh
            await self.load('bankAccounts');
            return self.bankAccounts[0];

        } catch (error) {
            throw error
        }
    }

    async getBalanceInfo({ request }: HttpContextContract) {
        const { penger_id } = request.qs()
        return await this.getChargeInfo(penger_id)
    }

    async getBankAccount({ request }: HttpContextContract) {
        const bankAccount = await BankAccount.query()
            .where('type', BankAccountType.PENGER)
            .where('holder_id', request.qs().penger_id)
            .firstOrFail()

        return bankAccount.uniqueId
    }

    private async getChargeInfo(pengerId: number) {
        // penger's bank account
        const bankAccount = await BankAccount.query()
            .where('type', BankAccountType.PENGER)
            .where('holder_id', pengerId)
            .firstOrFail()

        const setting = await SettingService.findByKey('stripe_charge_rate')
        const chargeRateFromSetting = parseFloat(setting.value) / 100

        const chargeRate = chargeRateFromSetting

        const transactions = Transaction.query()
            .where('to_bank_account_id', bankAccount.id)
            .where('bank_account_id', '!=', bankAccount.id)

        // Handle current balance that is not paid yet
        const currents = await transactions.where('is_paid', 0)
        const totalCurrentAmount = currents.reduce((prev, curr: Transaction) => {
            return (curr.amount / 100) + prev
        }, 0)
        const totalCurrentAmountCharge = totalCurrentAmount * chargeRate
        const totalCurrentAmountEarn = totalCurrentAmount - totalCurrentAmountCharge

        // Handle payout that is already paid
        const payoutTransactions = Transaction.query()
            .where('to_bank_account_id', bankAccount.id)
            .where('bank_account_id', '!=', bankAccount.id)
        const payouts = await payoutTransactions.where('is_paid', 1)
        const totalGross = payouts.reduce((prev, curr: Transaction) => {
            return (curr.amount / 100) + prev
        }, 0)

        // calculations
        const totalCharge = totalGross * chargeRate
        const totalEarn = totalGross - totalCharge

        // rounding
        const roundingAmount = Math.round(totalEarn) - totalEarn
        const roundedTotalEarn = Math.round(Number(totalEarn)) - roundingAmount

        // serializing
        const serializedTransactions = payouts.map(p => p.serialize({
            fields: {
                omit: ['id', 'to_bank_account_id', 'bank_account_id']
            }
        }));

        return {
            currency: 'RM',
            current_amount: totalCurrentAmount.toFixed(2),
            current_amount_charge: totalCurrentAmountCharge.toFixed(2),
            total_current_amount: totalCurrentAmountEarn.toFixed(2),
            total_gross: totalGross.toFixed(2),
            total_charge: totalCharge.toFixed(2),
            total_earn: totalEarn.toFixed(2),
            rounded_total_earn: roundedTotalEarn.toFixed(2),
            rounded_amount: roundingAmount.toFixed(2),
            charge_rate: chargeRate,
            transactions: serializedTransactions,
        }
    }

    async payout({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const { penger_id } = request.qs()

            // penger's bank account
            const bankAccount = await BankAccount.query()
                .where('type', BankAccountType.PENGER)
                .where('holder_id', penger_id)
                .firstOrFail()

            // get amount that is not paid out yet
            const { total_current_amount } = await this.getChargeInfo(penger_id)
            const totalAsCents = Math.round(Number(total_current_amount) * 100)

            if (totalAsCents === 0) {
                throw "Nothing to withdraw"
            }

            if ((totalAsCents > 200) === false) {
                throw "Unable to withdraw less than RM2.00"
            }

            // send penger total
            await StripeService.getStripe().transfers.create({
                amount: totalAsCents,
                currency: "myr",
                destination: bankAccount.uniqueId,
            });

            // get all unpaid transaction records
            const transactions = await Transaction.query()
                .where('to_bank_account_id', bankAccount.id)
                .where('bank_account_id', '!=', bankAccount.id)
                .where('is_paid', 0)

            // update all as paid
            for await (const transaction of transactions) {
                await transaction.useTransaction(trx).merge({ isPaid: true }).save()
                await trx.commit()
            }

            // // Deposit money
            // const paymentIntent = await StripePaymentService.deposit(fromCus.id, amount)

            // // Create custom record and save into transaction table. 
            // const transaction = new Transaction()
            // transaction.fill({
            //     toBankAccountId: toPengooAccounts[0].id,
            //     bankAccountId: self.bankAccounts[0].id,
            //     amount: amount,
            //     metadata: JSON.stringify(paymentIntent),
            // })

            // await self.bankAccounts[0].useTransaction(trx).related('transactions').save(transaction);

            // return paymentIntent;

        } catch (error) {
            console.log(error)
            await trx.rollback()
            throw error
        }
    }
}

export default new PengerService();
