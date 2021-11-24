import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DBTransactionService } from "../db/DBTransactionService";
import SimpleMailInterface, { SimpleMailMessage } from "Contracts/interfaces/SimpleMail.interface"
import Env from '@ioc:Adonis/Core/Env'
import got from 'got'
import Sentry from "@ioc:Adonis/Addons/Sentry";

class SimpleMailService implements SimpleMailInterface {
    async send(message: SimpleMailMessage): Promise<{ msg: string; }> {
        const url = Env.get('SIMPLEMAIL_ENDPOINT')

        try {
            const { body } = await got.post(url, {
                json: {
                    ...message,
                    smtp_user: Env.get('SMTP_USER'),
                    smtp_pass: Env.get('SMTP_PASS'),
                },
            })
            return {
                msg: body
            }
        } catch (error) {
            console.error(error)
            Sentry.captureException(error)
            return {
                msg: error
            }
        }
    }
}

export default new SimpleMailService()