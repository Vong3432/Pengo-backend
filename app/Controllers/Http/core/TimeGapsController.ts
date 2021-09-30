import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeGapService from 'App/Services/core/TimeGapService';
import { SuccessResponse } from "App/Services/ResponseService";

export default class TimeGapsController {
    async getUnits({ response }: HttpContextContract) {
        return SuccessResponse({response, data: TimeGapService.getTimeUnits()})
    }
}
