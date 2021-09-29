import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role, { Roles } from 'App/Models/Role'
import User from 'App/Models/User'
import GooCardService from 'App/Services/goocard/GooCardService'
import AvatarGenerateService from 'App/Services/helpers/AvatarGenerateService'

export default class PengooSeeder extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method

        const roleId = await Role.findByOrFail('name', Roles.Pengoo)

        const user = await User.updateOrCreate({
            username: 'JohnDoe'
        }, {
            email: 'user1@demo.com',
            password: '12345678',
            roleId: roleId.id,
            phone: '+60149257542',
            avatar: AvatarGenerateService.getAvatar('johndoe', {avatar: "micah", gender: "male"})!,
            age: 99
        })

        await user.load('goocard')

        if(user.goocard === null) {
            const card = await GooCardService.create('123456');
            await user.related('goocard').save(card);
        }
    }
}
