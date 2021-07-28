import Penger from "App/Models/Penger";
import User from "App/Models/User";
import { userRepository } from "App/Repositories/UserRepository";
import { ICreateStaffData, IUpdateStaffData } from "./IUser";

type Repository = typeof userRepository;

export class StaffService {
    userRepository: Repository;

    constructor({ userRepository }) {
        this.userRepository = userRepository
    }

    async create(data: ICreateStaffData, penger: Penger): Promise<User> {
        return await this.userRepository.createStaff(data, penger);
    }

}