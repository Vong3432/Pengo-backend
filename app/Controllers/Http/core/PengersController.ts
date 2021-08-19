import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PengerService } from 'App/Services/core/PengerService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';

export default class PengersController {
    private readonly service: PengerService = new PengerService();

    public async index(contract: HttpContextContract) {
        const { response } = contract;
        try {
            const pengers = await this.service.findAll(contract);
            return SuccessResponse({ response, data: pengers, code: 200 })
        }
        catch (error) {
            return ErrorResponse({ response, msg: error, code: 500 })
        }
    }

    public async findNearest(contract: HttpContextContract) {
        const { response } = contract;
        try {
            const pengers = await this.service.findNearestPengers(contract);
            return SuccessResponse({ response, data: pengers, code: 200 })
        }
        catch (error) {
            return ErrorResponse({ response, msg: error, code: 500 })
        }
    }

    public async findPopular(contract: HttpContextContract) {
        const { response } = contract;
        try {
            const pengers = await this.service.findPopularPengers(contract);
            return SuccessResponse({ response, data: pengers, code: 200 })
        }
        catch (error) {
            return ErrorResponse({ response, msg: error, code: 500 })
        }
    }

    public async show(contract: HttpContextContract) {
        const { response, request } = contract;
        try {
            const id = request.param('id');
            const penger = await this.service.findById(id)
            return SuccessResponse({ response, data: penger, code: 200 })
        } catch (error) {
            return ErrorResponse({ response, msg: error, code: 500 })
        }
    }

}