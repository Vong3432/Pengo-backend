import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RestfulAPIInterface from "./RestfulAPI.interface";

export default interface BookingRecordInterface extends RestfulAPIInterface {

}

export interface BookingRecordClientInterface extends RestfulAPIInterface {
    findById(id: number, contract?: HttpContextContract): Promise<any>;
}
