
import Setting from "App/Models/Setting";
import RestfulAPIInterface from "./RestfulAPI.interface";

export default interface SettingInterface extends RestfulAPIInterface {
    findByKey(key: string): Promise<Setting>
}