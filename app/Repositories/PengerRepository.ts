import Penger from "App/Models/Penger";
import { DBTransactionService } from "App/Services/DBTransactionService";

export const pengerRepository = {

    async findById(id: number): Promise<Penger | any> {
        try {
            const penger = await Penger.findByOrFail('id', id)
            return penger;
        } catch (error) {
            throw "Something went wrong"
        }
    },

}
