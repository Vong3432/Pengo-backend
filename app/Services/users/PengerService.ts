import Penger from "App/Models/Penger";

export class PengerService {
    pengerRepository: any;

    constructor({ pengerRepository }) {
        this.pengerRepository = pengerRepository
    }

    async findById(id: number): Promise<Penger> {
        return await this.pengerRepository.findById(id);
    }

}