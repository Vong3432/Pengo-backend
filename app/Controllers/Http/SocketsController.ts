import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingRecord from 'App/Models/BookingRecord';
import Penger from 'App/Models/Penger';
import { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import { PengerVerifyAuthorizationService } from 'App/Services/PengerVerifyAuthorizationService';
import { ErrorResponse, SuccessResponse } from 'App/Services/ResponseService';
import Ws from 'App/Services/socket/SocketService';

/**
 * does not use service pattern since
 * this controller is only used for joining user
 * into another room in socket
 * 
 * If role is Pengoo, pin is required
 * If roles is Penger, penger_id is required in request.qs()
 */
export default class SocketsController {
    public async verifyPass({ request, auth, response, bouncer }: HttpContextContract) {
        try {
            console.log("SocketsController: Verify pass called")
            
            const user = await auth.authenticate();
            const {
                record_id,
                pin
            } = request.body();
            const { penger_id } = request.qs()


            if (record_id == null || user == null) throw ('Failed to connect to socket')

            await user.load('role')

            const data = {
                auth: auth,
                record_id: record_id,
                pin,
                user,
                role: user.role.name,
            }

            console.log("pin", pin)
            console.log("role", user.role.name)

            // check is pengoo/penger
            if (user.role.name === Roles.Pengoo) {

                // is pengoo, check record and goocard relationship
                const pengoo = await User.find(user.id);
                await pengoo?.load('goocard');

                if (pengoo!.goocard == null || pengoo!.goocard.pin !== pin) {
                    throw "Unauthorized"
                }

                const item = await BookingRecord
                    .query()
                    .preload('item')
                    .where('id', record_id)
                    .where('goocard_id', pengoo!.goocard.id)
                    .first();

                if (item == null) {
                    throw "Unauthorized"
                }

            } else if (user.role.name === Roles.Founder || user.role.name === Roles.Staff) {
                if (!penger_id) throw "Unauthorized Penger"
                const validate = await Penger.query()
                    .where('id', penger_id)
                    .firstOrFail()
                await PengerVerifyAuthorizationService.isPenger(bouncer);
                await PengerVerifyAuthorizationService.isRelated(bouncer, validate);

                // is penger, check record and penger relationship
                const penger = await Penger.query()
                    .preload('pengerUsers', (q) => {
                        q.wherePivot('user_id', user.id);
                    }).where('id', penger_id)
                    .first();
                if (penger == null) {
                    throw "Unauthorized Penger"
                }
            }

            Ws.io.emit('rest-join', data);
            console.log('verifypass')
            return SuccessResponse({ response, msg: 'Connected' });
        } catch (error) {
            console.log('err:', error)
            return ErrorResponse({ response, msg: error });
        }
    }
    public async verifyCoupon({ request, auth, response }: HttpContextContract) {
        try {
            const user = await auth.authenticate();
            const {
                coupon_id,
                pin
            } = request.body();

            if (coupon_id == null || user == null) throw ('Failed to connect to socket')

            await user.load('role')

            const data = {
                auth: auth,
                coupon_id: coupon_id,
                pin,
                user,
                role: user.role.name,
            }
            Ws.io.emit('rest-join', data);
            console.log('verify coupon')
            return SuccessResponse({ response, msg: 'Connected' });
        } catch (error) {
            console.log('err:', error)
            return ErrorResponse({ response, msg: error });
        }
    }
}
