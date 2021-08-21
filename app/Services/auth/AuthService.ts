import AuthInterface from "Contracts/interfaces/Auth.interface";
import LoginUserValidator from "App/Validators/auth/LoginUserValidator";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import Role, { Roles } from "App/Models/Role";
import { RoleService } from "../role/RoleService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
export class AuthService implements AuthInterface {

    private readonly roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    async login({ request, auth }: HttpContextContract) {
        try {
            const payload = await request.validate(LoginUserValidator);
            const role = await this.roleService.findRole(Roles.Pengoo);

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
            const founder = await this.roleService.findRole(Roles.Founder);
            const staff = await this.roleService.findRole(Roles.Staff);

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
}