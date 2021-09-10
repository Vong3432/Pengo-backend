import User from "App/Models/User";
import PengooInterface from "Contracts/interfaces/Pengoo.interface";
import { DBTransactionService } from "../db/DBTransactionService";
import RegisterUserValidator from "App/Validators/auth/RegisterUserValidator";
import { Roles } from "App/Models/Role";
import RoleService from "../role/RoleService";
import CloudinaryService from "../cloudinary/CloudinaryService";
import GooCardService from "../goocard/GooCardService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
class PengooService implements PengooInterface {

    async createPengoo({ request, auth }: HttpContextContract) {
        const payload = await request.validate(RegisterUserValidator);
        const role = await RoleService.findRole(Roles.Pengoo);
        let publicId;

        // save image to cloud
        const { secure_url: url, public_id } = await CloudinaryService.uploadToCloudinary({ file: payload.avatar.tmpPath!, folder: "pengoo" });
        if (public_id) publicId = public_id;

        const data = {
            avatar: url,
            roleId: role.id,
            email: payload.email,
            phone: payload.phone,
            username: payload.username,
            password: payload.password,
            age: payload.age
        }

        // create card
        const card = await GooCardService.create(payload.pin);
        const user = new User();
        const trx = await DBTransactionService.init();
        try {
            user.fill({ ...data });
            user.useTransaction(trx)
            await user.related('goocard').save(card);
            await trx.commit();

            const token = await auth.use("api").attempt(payload.phone, payload.password, {
                expiresIn: "10 days"
            })

            return { user, token };
        } catch (error) {
            await trx.rollback();
            if (publicId)
                await CloudinaryService.destroyFromCloudinary(publicId);
            throw "Something went wrong"
        }
    }

    async update() {

    }
}

export default new PengooService();
