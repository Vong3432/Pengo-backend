import Penger from "App/Models/Penger";
import PengerInterface from "Contracts/interfaces/Penger.interface";

export class PengerService implements PengerInterface {
    async findById(id: number) {
        try {
            const penger = await Penger.findByOrFail('id', id)
            return penger;
        } catch (error) {
            throw "Something went wrong"
        }
    }

}