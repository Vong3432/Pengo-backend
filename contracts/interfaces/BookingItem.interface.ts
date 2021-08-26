import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RestfulAPIInterface from "./RestfulAPI.interface";

export default interface BookingItemInterface extends RestfulAPIInterface {
    findAllByPenger(contract: HttpContextContract): Promise<any[]>;
    findAllByPengerAndCategory(contract: HttpContextContract): Promise<any[]>;
    findByPengerAndId(contract: HttpContextContract): Promise<any>;
}

export interface BookingItemClientInterface {

}