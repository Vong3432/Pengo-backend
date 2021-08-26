import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default interface RestfulAPIInterface {
    findAll(contract: HttpContextContract): Promise<any[]>;
    findById(id: number): Promise<any>;
    create(contract: HttpContextContract): Promise<any>;
    update(contract: HttpContextContract): Promise<any>;
    delete(contract: HttpContextContract): Promise<any>;
}