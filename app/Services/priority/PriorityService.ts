
import PriorityInterface from "Contracts/interfaces/Priority.interface";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PriorityOption from "App/Models/PriorityOption";

class PriorityService implements PriorityInterface {
    async findAll({ }: HttpContextContract) {
        return PriorityOption.all();
    };

    async findById(id) {
        return PriorityOption.findByOrFail('id', id);
    };

    async create({ }: HttpContextContract) {
        return PriorityOption.firstOrFail();
    };

    async update({ }: HttpContextContract) {
        return PriorityOption.firstOrFail();
    };

    async delete({ }: HttpContextContract) {

    };
}

export default new PriorityService();
