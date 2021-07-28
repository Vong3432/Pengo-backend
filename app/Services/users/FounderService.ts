import User from "App/Models/User";
import { userRepository } from "App/Repositories/UserRepository";
import { ICreateFounderData } from "./IUser";

type Repository = typeof userRepository;

export class FounderService {

    userRepository: Repository;

    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async create(data: ICreateFounderData): Promise<User> {
        return await this.userRepository.create(data);
    }

}