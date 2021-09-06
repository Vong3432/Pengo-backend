import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default interface CreditPointsInterface {
    add(contract: HttpContextContract): Promise<any>;
    deduct(contract: HttpContextContract): Promise<any>;
}
