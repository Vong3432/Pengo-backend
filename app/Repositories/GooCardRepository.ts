import GooCard from "App/Models/GooCard";
import { DBTransactionService } from "App/Services/DBTransactionService";
import { ICreateGooCard } from "App/Services/goocard/IGooCard";

export const gooCardRepository = {

    async create(data: ICreateGooCard): Promise<GooCard> {
        const card = new GooCard();
        const trx = await DBTransactionService.init();
        try {
            await card.useTransaction(trx).fill({ ...data }).save();
            await trx.commit();
            return card;
        } catch (error) {
            await trx.rollback();
            throw "Something went wrong"
        }
    },

}
