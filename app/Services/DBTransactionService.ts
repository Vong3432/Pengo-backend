import Database, { TransactionClientContract } from "@ioc:Adonis/Lucid/Database"

export const DBTransactionService = {
    init: async (): Promise<TransactionClientContract> => {
        const trx = await Database.transaction();
        return trx;
    },
    commit: async (trx: TransactionClientContract) => {
        trx.commit();
    },
    rollback: async (trx: TransactionClientContract) => {
        trx.rollback();
    }
}