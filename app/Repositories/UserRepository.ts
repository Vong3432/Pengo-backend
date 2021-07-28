import GooCard from "App/Models/GooCard";
import Penger from "App/Models/Penger";
import User from "App/Models/User";
import { DBTransactionService } from "App/Services/DBTransactionService";

export const userRepository = {

    async create(data: any): Promise<User | any> {
        const user = new User();
        const trx = await DBTransactionService.init();
        try {
            await user.useTransaction(trx).fill({ ...data }).save();
            await trx.commit();
            return user;
        } catch (error) {
            await trx.rollback();
            throw "Something went wrong"
        }
    },

    async createPengoo(data: any, card: GooCard): Promise<User | any> {
        const user = new User();
        const trx = await DBTransactionService.init();
        try {
            user.fill({ ...data });
            user.useTransaction(trx)
            await user.related('goocard').save(card);
            await trx.commit();
            return user;
        } catch (error) {
            await trx.rollback();
            throw "Something went wrong"
        }
    },

    async createStaff(data: any, penger: Penger): Promise<User | any> {
        const staff = new User();
        const trx = await DBTransactionService.init();
        try {
            await staff.fill({ ...data }).save();
            // link staff to penger
            await penger.related('pengerUsers').attach([staff.id], trx);
            await trx.commit();
            return staff;
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
            return user;
        } catch (error) {
            await trx.rollback();
            throw "Something went wrong"
        }
    }
}
