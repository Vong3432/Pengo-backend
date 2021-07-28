import GooCard from "App/Models/GooCard";
import User from "App/Models/User";
import { userRepository } from "App/Repositories/UserRepository";
import { ICreateUserData, IUpdateUserData } from "./IUser";

type Repository = typeof userRepository;

export class PengooService {

    userRepository: Repository;

    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async create(data: ICreateUserData, card: GooCard): Promise<User> {
        return await this.userRepository.createPengoo(data, card);
    }

    async update(data: IUpdateUserData) {

    }
}