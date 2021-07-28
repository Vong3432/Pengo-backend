import GooCard from "App/Models/GooCard";
import User from "App/Models/User";
import { DBTransactionService } from "App/Services/DBTransactionService";
import { ICreateGooCard } from "App/Services/goocard/IGooCard";

export const gooCardRepository = {

    async create(data: ICreateGooCard): Promise<User | any> {
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

    async update(data: any, id: Number): Promise<User> {
        const trx = await DBTransactionService.init();
        try {
            const user = await User.findByOrFail('id', id);
            await user.useTransaction(trx).merge({ ...data }).save();
            await trx.commit();
            return this.user;
        } catch (error) {
            await trx.rollback();
            throw "Something went wrong"
        }
    }
}
