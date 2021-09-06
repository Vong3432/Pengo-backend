import GoocardNotVerifiedException from "App/Exceptions/GoocardNotVerifiedException";
import GooCard from "App/Models/GooCard";
export default interface GoocardInterface {
    create(pin: string): Promise<GooCard>;
    verify(pin: string, userId: number): Promise<GooCard | GoocardNotVerifiedException>;
}