import User from "App/Models/User";
import { ICreateFounderData } from "./IUser";

export class FounderService {

    userRepository: any;

    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async create(data: ICreateFounderData): Promise<User> {
        return await this.userRepository.create(data);
    }

}