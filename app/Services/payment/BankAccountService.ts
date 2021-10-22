import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import BankAccountInterface from "Contracts/interfaces/BankAccount.interface"
import BankAccount, { BankAccountType } from "App/Models/BankAccount";
import GooCard from "App/Models/GooCard";
import Penger from "App/Models/Penger";

class BankAccountService implements BankAccountInterface {

    async findAccounts(holderId, type: BankAccountType) {
        if (type === BankAccountType.PENGER) {
            const penger = await Penger.findOrFail(holderId)
            return penger.related('bankAccounts').query()
        } else if (type === BankAccountType.GOOCARD) {
            const card = await GooCard.findOrFail(holderId)
            return card.related('bankAccounts').query()
        }
    }

    async create(uniqueId, type: BankAccountType, holderId) {
        const trx = await DBTransactionService.init()
        try {
            const newBankAcc = new BankAccount()

            newBankAcc.fill({
                uniqueId: uniqueId,
                type: type,
                holderId: holderId
            });

            if (type === BankAccountType.PENGER) {
                const penger = await Penger.findOrFail(holderId)
                await penger.useTransaction(trx).related('bankAccounts').save(newBankAcc);
                await trx.commit()
            } else if (type === BankAccountType.GOOCARD) {
                const card = await GooCard.findOrFail(holderId)
                await card.useTransaction(trx).related('bankAccounts').save(newBankAcc);
                await trx.commit();
            }

            return newBankAcc;
        } catch (error) {
            throw error;
        }

    }
}

export default new BankAccountService()