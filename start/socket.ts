import BookingRecord from 'App/Models/BookingRecord';
import Penger from 'App/Models/Penger';
import GoocardLogService from 'App/Services/goocard/GoocardLogService'
import { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import Ws from '../app/Services/socket/SocketService'
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import BookingRecordClientService from 'App/Services/booking/BookingRecordClientService';
import Coupon from 'App/Models/Coupon';
import CouponClientService from 'App/Services/coupon/CouponClientService';

Ws.boot()

type PassScanPayload = {
    record_id: number,
    auth: AuthContract,
    user: User,
    role: Roles,
    pin: string
}

type CouponScanPayload = {
    coupon_id: number,
    auth: AuthContract,
    user: User,
    role: Roles,
    pin: string
}

/**
 * Listen for incoming socket connections
 */

Ws.io.on('connection', (socket) => {

    // handle verify pass
    socket.on('join-pass', (payload: PassScanPayload) => {
        try {
            console.log('join pass')
            verifyPass(socket, payload)
        } catch (error) {
            console.log(error)
        }
    })

    // handle verify coupon
    socket.on('join-coupon', async (payload) => {
        try {
            verifyCoupon(socket, payload)
        } catch (error) {
            console.log(error)
        }
    })
})

function verifyCoupon(socket, payload: CouponScanPayload) {
    const { coupon_id, auth, role, pin, user } = payload

    // join room
    socket.join(`verify/coupon${coupon_id}`, () => {
        console.log('join room')
        socket.emit('joined room')
    })

    // ---------------------------------
    // listen for room socket events
    // ---------------------------------
    socket.on('start verifying', async ({ to }) => {

        console.log('verifying coupon')

        // is pengoo, check record and goocard relationship
        const pengoo = await User.find(user.id);
        await pengoo?.load('goocard');

        if (pengoo!.goocard == null || pengoo!.goocard.pin !== pin) {
            return emitMsg(socket, to, "unauthorized")
        }

        // check record exist
        const couponId = coupon_id;
        const goocard = pengoo!.goocard

        // Update is_used in `goocard_coupon` pivot table
        await goocard.related('coupons').sync({
            [couponId]: {
                is_used: true
            }
        }, false)

        const coupon = await Coupon.findOrFail(coupon_id)

        // check is pengoo/penger
        if (role === Roles.Pengoo) {
            const logMsg = await CouponClientService.toLog(coupon, "USE");
            await GoocardLogService.saveLog(logMsg, auth)
        }

        emitMsg(socket, to, "verified success", { msg: `Verified successfully`, shouldUpdateCredit: true })
    })
}

function verifyPass(socket, payload: PassScanPayload) {

    const { record_id, auth, role, pin, user } = payload

    // join room
    socket.join(`verify/record${record_id}`, () => {
        console.log('join room')
        socket.emit('joined room')
    })

    // ---------------------------------
    // listen for room socket events
    // ---------------------------------
    socket.on('start verifying', async ({ to }) => {

        console.log('verifying')

        // check record exist
        const query = BookingRecord.query().preload('penger');
        const data = await query.where('id', record_id).first();

        if (data == null) {
            return emitMsg(socket, to, 'verified failed')
        }

        console.log("Role:", role)

        // // Check if record is already verified before
        // // do something...
        if (data.isUsed === 1) {
            console.log('is used')
            return emitMsg(socket, to, "verified success", { msg: 'Already verified', shouldUpdateCredit: false })
        }

        // Update `booking_records`
        // ... do something
        await data.merge({ isUsed: 1 })
            .save();

        emitMsg(socket, to, "verified success", { msg: `Verified successfully`, shouldUpdateCredit: true })
    })

    // ---------------------------------
    // listen for room socket events ended
    // ---------------------------------
}

function emitMsg(socket, to, target: string, payload?) {
    // Emit to both pengoo/penger
    console.log(`Sending msg to chan:${target} with msg ${JSON.stringify(payload)}`)
    socket.to(to).emit(target, payload)
    socket.emit(target, payload)
}
