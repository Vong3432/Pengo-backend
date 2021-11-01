import AuthInterface from "Contracts/interfaces/Auth.interface";
import LoginUserValidator from "App/Validators/auth/LoginUserValidator";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import { Roles } from "App/Models/Role";
import RoleService from "../role/RoleService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UnAuthorizedException from "App/Exceptions/UnAuthorizedException";
import Penger from "App/Models/Penger";
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
            const { email, password } = request.body();

            if (email == null || password == null)
                throw "Bad request";

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
}

export default new AuthService();
