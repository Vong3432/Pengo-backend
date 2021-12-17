import Sentry from '@ioc:Adonis/Addons/Sentry';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction';
import { DBTransactionService } from 'App/Services/db/DBTransactionService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import CreateTransactionValidator from 'App/Validators/pengoo/CreateTransactionValidator';

export default class TransactionsController {
    public async store(contract: HttpContextContract) {
        const { request, response, auth } = contract
        const trx = await DBTransactionService.init();
        try {
            const payload = await request.validate(CreateTransactionValidator)

            const user = await auth.authenticate()
            await user.load('goocard', q => q.preload('bankAccounts'))

            if (user.goocard.bankAccounts[0].id !== payload.bank_account_id) {
                throw Error("Invalid request")
            }

            // Create custom record and save into transaction table. 
            const transaction = new Transaction()
            transaction.fill({
                toBankAccountId: payload.to_bank_account_id,
                bankAccountId: payload.bank_account_id,
                amount: payload.amount,
                metadata: JSON.stringify(payload.metadata),
            })
            await user.goocard.bankAccounts[0].useTransaction(trx).related('transactions').save(transaction);
            await trx.commit();

            return SuccessResponse({ response, msg: "Success", data: transaction })
        } catch (error) {
            Sentry.captureException(error);
            await trx.rollback()
            return ErrorResponse({ response, msg: error.messages || error })
        }
    }
}
