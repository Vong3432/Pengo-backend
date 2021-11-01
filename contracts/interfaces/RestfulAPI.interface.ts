import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default interface RestfulAPIInterface {
    findAll(contract: HttpContextContract): Promise<any[]>;
    findById(id: number, auth?: AuthContract | HttpContextContract): Promise<any>;
    create(contract: HttpContextContract): Promise<any>;
    update(contract: HttpContextContract): Promise<any>;
    delete(contract: HttpContextContract): Promise<any>;
}