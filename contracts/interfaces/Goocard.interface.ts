import GooCard from "App/Models/GooCard";

export default interface GoocardInterface {
    create(pin: string): Promise<GooCard>;
}