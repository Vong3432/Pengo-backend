import { GoocardLogType } from "App/Models/GooCardLog";

export type LogMsg = {
    title: string
    body: string,
    type: GoocardLogType
}

export type LogType = "USE" | "GET"

export default interface LogInterface<T> {
    toLog(data: T, type: LogType): Promise<LogMsg | Error>
}
