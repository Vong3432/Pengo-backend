import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default interface CreditPointsInterface {
    add(record_ig: number, auth: AuthContract): Promise<any>;
    deduct(amount: number, pengerId: number, auth: AuthContract): Promise<any>;
}
