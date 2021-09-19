import { DBTransactionService } from "../db/DBTransactionService";
import GoocardLogInterface from "Contracts/interfaces/GoocardLog.interface"
import GooCardLog from "App/Models/GooCardLog";
import { LogMsg } from "Contracts/interfaces/Log.interface";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";

class GoocardLogService implements GoocardLogInterface {
    async saveLog(data: LogMsg, auth: AuthContract): Promise<GooCardLog | Error> {
        const trx = await DBTransactionService.init()
        try {
            const pengoo = await auth.authenticate()
            const { title, body, type } = data;

            const log = new GooCardLog()
            log.fill({
                title,
                body,
                type
            })

            await pengoo.useTransaction(trx).goocard.related('logs').save(log);
            await trx.commit()

            return log;
        } catch (error) {
            await trx.rollback()
            throw error
        }
    }
}

export default new GoocardLogService()