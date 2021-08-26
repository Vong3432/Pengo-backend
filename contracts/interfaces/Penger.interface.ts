import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RestfulAPIInterface from "./RestfulAPI.interface";
export default interface PengerInterface extends RestfulAPIInterface {

}

export interface PengerClientInterface {
    findNearestPengers(contract: HttpContextContract): Promise<any[]>;
    findPopularPengers(contract: HttpContextContract): Promise<any[]>;
}