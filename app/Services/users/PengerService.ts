import Penger from "App/Models/Penger";

export class PengerService {
    async findById(id: number) {
        try {
            const penger = await Penger.findByOrFail('id', id)
            return penger;
        } catch (error) {
            throw "Something went wrong"
        }
    }

}