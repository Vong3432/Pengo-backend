import AuthInterface from "Contracts/interfaces/Auth.interface";
import LoginUserValidator from "App/Validators/auth/LoginUserValidator";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import { Roles } from "App/Models/Role";
import RoleService from "../role/RoleService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UnAuthorizedException from "App/Exceptions/UnAuthorizedException";
import Env from '@ioc:Adonis/Core/Env'
import { DBTransactionService } from "../db/DBTransactionService";
import UpdateProfileValidator from "App/Validators/auth/UpdateProfileValidator";
import CloudinaryService from "../cloudinary/CloudinaryService";
import Sentry from "@ioc:Adonis/Addons/Sentry";

class AuthService implements AuthInterface {


    async login({ request, auth }: HttpContextContract) {
        try {
            const payload = await request.validate(LoginUserValidator);
            const role = await RoleService.findRole(Roles.Pengoo);

            // get user
            const user = await User.query().where('phone', payload.phone).first();

            if (!user) throw "No account found, please try again.";

            if (user.roleId !== role.id)
                throw "Penger is not allowed."

            if (await Hash.verify(user.password, payload.password) === false) {
                throw "Password is incorrect";
            }

            const token = await auth.use("api").attempt(payload.phone, payload.password, {
                expiresIn: "10 days"
            })

            await user.load('locations')

            return {
                user,
                token
            }
        } catch (error) {
            throw error;
        }
    };

    async loginPenger({ request, auth }: HttpContextContract) {
        try {
            const payload = await request.validate(LoginUserValidator);
            const founder = await RoleService.findRole(Roles.Founder);
            const staff = await RoleService.findRole(Roles.Staff);

            // get user
            const user = await User.query().where('phone', payload.phone).first();

            if (!user) throw "No account found, please try again.";

            if (user.roleId !== staff.id && user.roleId !== founder.id)
                throw "Pengoo is not allowed."

            if (await Hash.verify(user.password, payload.password) === false) {
                throw "Password is incorrect";
            }

            const token = await auth.use("api").attempt(payload.phone, payload.password, {
                expiresIn: "10 days"
            })

            const pengers = (await user.related('pengerUsers').query().preload('location')).map(p => p.serialize({
                relations: {
                    location: {
                        fields: {
                            pick: ['geolocation', 'address', 'street']
                        }
                    }
                }
            }));

            return {
                user,
                pengers,
                token
            }
        } catch (error) {
            throw error;
        }
    };

    async loginAdmin({ request, auth }: HttpContextContract) {
        try {
            const { email, password, secret } = request.body();

            if (email == null || password == null || secret == null)
                throw "Bad request";

            // verify secret
            const envSecret = Env.get('PENGO_ADMIN_SECRET')

            if (envSecret !== secret) throw "Invalid secret"

            const role = await RoleService.findRole(Roles.Admin);

            // get user
            const admin = await User.query().where('email', email).first();

            if (!admin) throw "No account found, please try again.";

            if (admin.roleId !== role.id)
                throw new UnAuthorizedException("");

            if (await Hash.verify(admin.password, password) === false) {
                throw new UnAuthorizedException("")
            }

            const token = await auth.use("api").attempt(email, password, {
                expiresIn: "10 days"
            })

            return {
                admin,
                token
            }
        } catch (error) {
            throw error;
        }
    }

    async updateProfile({ request, auth }: HttpContextContract) {
        const trx = await DBTransactionService.init()
        let publicId;

        try {
            const { avatar, ...data } = await request.validate(UpdateProfileValidator);
            const user = await auth.authenticate();
            await user.load('role')

            let avatarUrl = user.avatar;

            if (avatar) {
                const { secure_url: url, public_id } = await CloudinaryService.uploadToCloudinary({ file: avatar.tmpPath!, folder: "pengoo" });
                avatarUrl = url
                if (public_id) publicId = public_id
            }

            await user.useTransaction(trx).merge({
                ...data,
                avatar: avatarUrl,
            }).save()

            await trx.commit();

            const token = await auth.use("api").generate(user, {
                expiresIn: "10 days"
            })

            if (user.role.name === Roles.Pengoo) {
                await user.load('locations')
                return {
                    user,
                    token,
                }
            } else if (user.role.name === Roles.Staff || user.role.name === Roles.Founder) {
                const pengers = (await user.related('pengerUsers').query().preload('location')).map(p => p.serialize({
                    relations: {
                        location: {
                            fields: {
                                pick: ['geolocation', 'address', 'street']
                            }
                        }
                    }
                }));
                return {
                    user,
                    pengers,
                    token,
                }
            }

        } catch (error) {
            Sentry.captureException(error)
            if (publicId)
                await CloudinaryService.destroyFromCloudinary(publicId);
            await trx.rollback();
            throw error
        }
    }
}

export default new AuthService();
