import Penger from "App/Models/Penger";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
export default interface PengerInterface {
    findById(id: number): Promise<Penger | any>;
}

export interface PengerClientInterface {
    findById(id: number): Promise<Penger | any>;
    findAll(contract: HttpContextContract): Promise<Penger[]>;
    findNearestPengers(contract: HttpContextContract): Promise<any[]>;
    findPopularPengers(contract: HttpContextContract): Promise<any[]>;
}