import BookingRecord from 'App/Models/BookingRecord';
import GooCardLog from 'App/Models/GooCardLog';
import Penger from 'App/Models/Penger';
import { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import { DateConvertHelperService } from 'App/Services/helpers/DateConvertHelperService';
import Ws from '../app/Services/socket/SocketService'


Ws.boot()

/**
 * Listen for incoming socket connections
 */

Ws.io.on('connection', (socket) => {

    //testing
    socket.emit('news', () => {
        return { hello: 'world' };
    })

    socket.on('join', async ({
        record_id,
        user,
        role,
        pin
    }: {
        record_id: number,
        user: User,
        role: Roles,
        pin: string
    }) => {

        try {
            // join room
            socket.join(`verify/record${record_id}`, () => {
                socket.emit('joined room')
            })

            // ---------------------------------
            // listen for room socket events
            // ---------------------------------
            socket.on('start verifying', async ({ to }) => {
                socket.to(to).emit('verifying')
                socket.emit('verifying')
                // check record exist
                const query = BookingRecord.query().preload('penger');
                const data = await query.where('id', record_id).first();
                if (data == null) {
                    socket.to(to).emit('verified failed')
                    return socket.emit('verified failed')
                }

                // Check if record is already verified before
                // do something...
                if (data.isUsed) {
                    socket.to(to).emit('verified success', { msg: 'Already verified', shouldUpdateCredit: false })
                    return socket.emit('verified success', { msg: 'Already verified', shouldUpdateCredit: false })
                }

                // check is pengoo/penger
                if (role === Roles.Pengoo) {

                    // is pengoo, check record and goocard relationship
                    const pengoo = await User.find(user.id);
                    await pengoo?.load('goocard');

                    if (pengoo!.goocard == null || pengoo!.goocard.pin !== pin) {
                        socket.to(to).emit('unauthorized');
                        return socket.emit('unauthorized');
                    }

                    const item = await query
                        .preload('item')
                        .where('id', data.id)
                        .where('goocard_id', pengoo!.goocard.id)
                        .first();

                    if (item == null) {
                        socket.to(to).emit('unauthorized');
                        return socket.emit('unauthorized');
                    }


                    const getCurrentTime = await new DateConvertHelperService()
                        .fromDateToReadableText(Date.now(), {
                            dateStyle: 'full',
                            timeStyle: 'medium'
                        });

                    // save log
                    const log = new GooCardLog();
                    log.title = `${item.item.name} booking pass verified successfully.`
                    log.body = getCurrentTime;
                    //log.extra = creditPoints

                    await pengoo!.goocard.related('logs').save(log);

                } else if (role === Roles.Founder || role === Roles.Staff) {
                    // is penger, check record and penger relationship
                    const penger = await Penger.query()
                        .preload('pengerUsers', (q) => {
                            q.wherePivot('user_id', user.id);
                        }).where('id', data.penger.id)
                        .first();
                    if (penger == null) {
                        socket.to(to).emit('unauthorized');
                        return socket.emit('unauthorized');
                    }
                }

                // Update `booking_records`
                // ... do something
                await data.merge({ isUsed: 1 }).save();

                // Emit to both pengoo/penger
                socket.to(to).emit('verified success', { msg: `Verified successfully`, shouldUpdateCredit: true })
                socket.emit('verified success', { msg: 'Verified successfully', shouldUpdateCredit: true })
            })

            // ---------------------------------
            // listen for room socket events ended
            // ---------------------------------
        } catch (error) {
            console.log(error)
        }
    })
})

