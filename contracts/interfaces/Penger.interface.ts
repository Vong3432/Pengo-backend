import Penger from "App/Models/Penger";

export default interface PengerInterface {
    findById(id: number): Promise<Penger | any>
}