import Penger from "App/Models/Penger";
import User from "App/Models/User";
import { ICreateStaffData } from "App/Services/users/IUser";

export default interface StaffInterface {
    createStaff(data: ICreateStaffData, penger: Penger): Promise<User>;
}