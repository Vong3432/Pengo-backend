import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
export default interface StaffInterface {
    createStaff(contract: HttpContextContract): Promise<User>;
}