
import GooCard from "App/Models/GooCard";
import { ICreateGooCard } from "./IGooCard";

export class GooCardService {

    gooCardRepository: any;

    constructor({ gooCardRepository }) {
        this.gooCardRepository = gooCardRepository
    }

    async create(data: ICreateGooCard): Promise<GooCard> {
        return await this.gooCardRepository.create(data);
    }
}