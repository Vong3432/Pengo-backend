import GooCard from "App/Models/GooCard";
import User from "App/Models/User";
import { ICreateUserData, IUpdateUserData } from "./IUser";

export class PengooService {

    userRepository: any;

    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async create(data: ICreateUserData, card: GooCard): Promise<User> {
        return await this.userRepository.createPengoo(data, card);
    }

    async update(data: IUpdateUserData) {

    }
}