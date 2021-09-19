import GooCardLog from "App/Models/GooCardLog";
import { LogMsg } from "./Log.interface";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";

/*
*   -------------------------
*   Logs that need to save
*   -------------------------
*   1. Use pass successfully (BookingRecordClientService)
*   2. Use coupon successfully (CouponClientService)
*   3. Redeem coupon suscessfully (CouponClientService)
*/
export default interface GoocardLogInterface {
    saveLog(data: LogMsg, auth: AuthContract): Promise<GooCardLog | Error>
}
