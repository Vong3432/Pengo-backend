import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserInterface from "Contracts/interfaces/User.interface"
import User from "App/Models/User";

class UserRegValidateService implements UserInterface {
    public async checkEmail({ request }: HttpContextContract) {
        return await User.query().where('email', request.body().email).first();
    }
    public async checkPhone({ request }: HttpContextContract) {
        return await User.query().where('phone', request.body().phone).first();
    }
}

export default new UserRegValidateService();
