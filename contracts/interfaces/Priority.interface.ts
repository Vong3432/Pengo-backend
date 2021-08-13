import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PriorityOption from "App/Models/PriorityOption";

export default interface PriorityInterface {
    findAll(contract: HttpContextContract): Promise<PriorityOption[]>;
    findById(id: number): Promise<PriorityOption>;
    create(contract: HttpContextContract): Promise<PriorityOption>;
    update(contract: HttpContextContract): Promise<PriorityOption>;
    delete(contract: HttpContextContract): Promise<any>;
}