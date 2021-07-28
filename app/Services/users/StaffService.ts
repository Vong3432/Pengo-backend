import Penger from "App/Models/Penger";
import User from "App/Models/User";
import { ICreateStaffData, IUpdateStaffData } from "./IUser";

export class StaffService {
    userRepository: any;

    constructor({ userRepository }) {
        this.userRepository = userRepository
    }

    async create(data: ICreateStaffData, penger: Penger): Promise<User> {
        return await this.userRepository.createStaff(data, penger);
    }

}