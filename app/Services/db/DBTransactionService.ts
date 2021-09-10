import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";

const Database = import("@ioc:Adonis/Lucid/Database").then(d => d.default);

export const DBTransactionService = {
    init: async (): Promise<TransactionClientContract> => {
        const trx = await (await Database).transaction();
        return trx;
    },
    commit: async (trx: TransactionClientContract) => {
        trx.commit();
    },
    rollback: async (trx: TransactionClientContract) => {
        trx.rollback();
    }
}