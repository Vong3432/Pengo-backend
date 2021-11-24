import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export type SimpleMailMessage = {
    email: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
    callback_url?: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    callback_data?: {};
}

export default interface SimpleMailInterface {
    send(message: SimpleMailMessage): Promise<{ msg: string }>
}
