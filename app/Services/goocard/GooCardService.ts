
import GooCard from "App/Models/GooCard";
import GoocardInterface from "Contracts/interfaces/Goocard.interface";
import { DBTransactionService } from "../DBTransactionService";
export class GooCardService implements GoocardInterface {
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
}