
import GooCard from "App/Models/GooCard";
import { ICreateGooCard } from "./IGooCard";
import { gooCardRepository } from "App/Repositories/GooCardRepository";

type Repository = typeof gooCardRepository;

export class GooCardService {

    gooCardRepository: Repository;

    constructor({ gooCardRepository }) {
        this.gooCardRepository = gooCardRepository
    }

    async create(data: ICreateGooCard): Promise<GooCard> {
        return await this.gooCardRepository.create(data);
    }
}