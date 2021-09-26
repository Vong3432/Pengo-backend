import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import Ws from 'App/Services/socket/SocketService';

// does not use service pattern since
// this controller is only used for joining user
// into another room in socket
export default class SocketsController {
    public async verifyPass({ request, auth, response }: HttpContextContract) {
        try {
            const user = await auth.authenticate();
            const {
                record_id,
                pin
            } = request.body();

            if (record_id == null || user == null) throw ('Failed to connect to socket')

            await user.load('role')

            const data = {
                auth: auth,
                record_id: record_id,
                pin,
                user,
                role: user.role.name,
            }
            Ws.io.emit('rest-join', data);
            console.log('verifypass')
            return SuccessResponse({ response, msg: 'Connected' });
        } catch (error) {
            console.log('err:', error)
            return ErrorResponse({ response, msg: error });
        }
    }
}
