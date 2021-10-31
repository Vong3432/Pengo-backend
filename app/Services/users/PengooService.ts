import User from "App/Models/User";
import PengooInterface from "Contracts/interfaces/Pengoo.interface";
import { DBTransactionService } from "../db/DBTransactionService";
import RegisterUserValidator from "App/Validators/auth/RegisterUserValidator";
import { Roles } from "App/Models/Role";
import RoleService from "../role/RoleService";
import CloudinaryService from "../cloudinary/CloudinaryService";
import GooCardService from "../goocard/GooCardService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SaveUserLocationValidator from "App/Validators/pengoo/SaveUserLocationValidator";
import GeoService from "../GeoService";
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

    async getLocations({ auth }: HttpContextContract) {
        const user = await auth.authenticate()
        return await user.related('locations').query()
    }

    /**
     * 
     * @description 
     * - This method is used when user save new location 
     * - or set a previously added location as favourite 
     * - or update previously added location's info.
     */
    async setLocation({ request, auth }: HttpContextContract) {
        const trx = await DBTransactionService.init()
        try {
            const user = await auth.authenticate();
            const { latitude, longitude, ...data } = await request.validate(SaveUserLocationValidator);

            const geoObj = JSON.stringify({
                latitude: latitude,
                longitude: longitude,
            })

            const savedLocation = await user.useTransaction(trx).related('locations').updateOrCreate({
                geolocation: geoObj,
            }, {
                ...data,
                geolocation: geoObj,
                street: await GeoService.coordinateToStreet(latitude, longitude),
                address: await GeoService.coordinateToShortAddress(latitude, longitude),
                isFav: 1,
            })

            await user.load('locations')

            // set other locations isFav to false
            for (const location of user.locations) {
                if (location.id !== savedLocation.id) {
                    location.merge({ isFav: 0 })
                    await location.save()
                }
            }

            await trx.commit();

        } catch (error) {
            await trx.rollback()
            throw error;
        }
    }

    async markAllAsNotFav({ auth }: HttpContextContract) {
        const trx = await DBTransactionService.init()
        try {
            const user = await auth.authenticate()
            await user.useTransaction(trx).load('locations')

            // set other locations isFav to false
            for (const location of user.locations) {
                location.merge({ isFav: 0 })
                await location.save()
            }

            await trx.commit()

        } catch (error) {
            await trx.rollback()
            throw error
        }
    }
}

export default new PengooService();
