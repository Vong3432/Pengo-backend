import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import UserInterface from "Contracts/interfaces/User.interface"
import User from "App/Models/User";
import Role, { Roles } from "App/Models/Role";

class UserService implements UserInterface {

    async findAll({ request }: HttpContextContract) {
        const query = User.query()

        const page: number = request.qs().page ?? 1
        const name = request.qs().name
        const status = request.qs().is_banned ?? 0
        const roleId: number = request.qs().role

        // exclude admin
        const adminRoleId = (await Role.findByOrFail('name', Roles.Admin)).id
        await query.whereNot('role_id', adminRoleId)

        // filter ban status
        query.where('is_banned', status)

        if (name) {
            const trimName: string = name.toString().trim()
            query.where("username", "like", `%${trimName}%`)
        }

        if (roleId) {
            query.where("role_id", roleId)
        }

        await query.preload("role")

        return await query.paginate(page)
    };

    async findById(id: number) {
        return await User.query()
            .where('id', id)
            .preload('role')
            .firstOrFail();
    };

    async create({ }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    };

    async update({ request }: HttpContextContract) {
        const trx = await DBTransactionService.init();
        try {
            const ban: boolean = request.body().terminate
            const user = await this.findById(request.param('id'))

            console.log(ban)

            await user.useTransaction(trx).merge({
                isBanned: ban === true ? 1 : 0
            }).save()

            await trx.commit()

            return user;

        } catch (error) {
            await trx.rollback();
            throw error;
        }

    };

    async delete({ }: HttpContextContract) {

    };

}

export default new UserService()