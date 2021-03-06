import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import RestfulAPIInterface from "./RestfulAPI.interface";

export default interface BookingRecordInterface extends RestfulAPIInterface {

}

export interface BookingRecordClientInterface extends RestfulAPIInterface {
    findById(id: number, auth?: AuthContract): Promise<any>;
}
