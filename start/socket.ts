import BookingRecord from 'App/Models/BookingRecord';
import Penger from 'App/Models/Penger';
import { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
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
                const data = await BookingRecord.query().preload('penger').where('id', record_id).first();
                if (data == null) {
                    socket.to(to).emit('verified failed')
                    return socket.emit('verified failed')
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

                    const item = await BookingRecord
                        .query()
                        .preload('item')
                        .where('id', data.id)
                        .where('goocard_id', pengoo!.goocard.id)
                        .first();
                    if (item == null) {
                        socket.to(to).emit('unauthorized');
                        return socket.emit('unauthorized');
                    }
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


                socket.to(to).emit('verified success')
                socket.emit('verified success')
            })

            // ---------------------------------
            // listen for room socket events ended
            // ---------------------------------
        } catch (error) {
            console.log(error)
        }
    })
})

