
import GoocardNotVerifiedException from "App/Exceptions/GoocardNotVerifiedException";
import GooCard from "App/Models/GooCard";
import GoocardInterface from "Contracts/interfaces/Goocard.interface";
import { DBTransactionService } from "../db/DBTransactionService";
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
}

export default new GooCardService();
