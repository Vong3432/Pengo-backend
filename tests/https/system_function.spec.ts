import Database from '@ioc:Adonis/Lucid/Database';
import { BASE_URL } from 'Config/const';
import test, { group } from 'japa'
import supertest from 'supertest'
import SystemFunction from 'App/Models/SystemFunction'
import Role, { Roles } from 'App/Models/Role';
import User from 'App/Models/User';
import Env from '@ioc:Adonis/Core/Env'

test.group('Testing system_function module', (group) => {

    let fakedAdmin: User;
    let token: string;

    group.before(async () => {
        // save the current state of db before testing
        await Database.beginGlobalTransaction()

        const roleId = await Role.findByOrFail('name', Roles.Admin)

        fakedAdmin = await User.updateOrCreate({
            username: 'testadmin'
        }, {
            email: 'testadmin@gmail.com',
            password: 'testadmin',
            roleId: roleId.id,
            phone: '0000000000',
            avatar: 'https://robohash.org/2627e0754741a35d48de82c34a4c6bd1?set=set4&bgset=&size=400x400',
            age: 99
        })

        await supertest(BASE_URL).post('/auth/admin/login').send({
            email: fakedAdmin.email,
            password: 'testadmin',
            secret: Env.get('PENGO_ADMIN_SECRET')
        }).expect(200).then(response => {
            token = response.body.data.token.token
        })
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test.skipInCI('[GET]: Find all system functions', async (assert) => {
        const { statusCode } = await supertest(BASE_URL).get('/admin/system-functions').set('Authorization', 'Bearer ' + token).expect(200)
        assert.isTrue(statusCode === 200)
    })

    test.skipInCI('[POST]: Create new system function', async (assert) => {
        const { statusCode } = await supertest(BASE_URL)
            .post('/admin/system-functions')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'F1',
                description: 'This is system func',
                is_premium: 1,
                price: 20
            })
            .expect(200)
        assert.isTrue(statusCode === 200)
    })

    test.skipInCI('[GET]: Find a system function', async (assert) => {
        const sysFunc = await SystemFunction.all()
        const { statusCode } = await supertest(BASE_URL).get(`/admin/system-functions/${sysFunc[0].id}`).set('Authorization', 'Bearer ' + token).expect(200)
        assert.isTrue(statusCode === 200)
    })

    test.skipInCI('[UPDATE]: Update system functions', async (assert) => {
        const sysFunc = await SystemFunction.all()
        const { statusCode } = await supertest(BASE_URL)
            .put(`/admin/system-functions/${sysFunc[0].id}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'F1',
                description: 'This is system func',
                is_premium: 0,
            })
            .expect(200)
        assert.isTrue(statusCode === 200)
    })

    test.skipInCI('[DELETE]: Delete system functions', async (assert) => {
        const sysFunc = await SystemFunction.all()
        const { statusCode } = await supertest(BASE_URL).del(`/admin/system-functions/${sysFunc[0].id}`).set('Authorization', 'Bearer ' + token).expect(200)
        assert.isTrue(statusCode === 200)
    })
})
