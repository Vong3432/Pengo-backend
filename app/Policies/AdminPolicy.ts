import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { Roles } from 'App/Models/Role'
import User from 'App/Models/User'

export default class AdminPolicy extends BasePolicy {
    public async isAdmin(user: User) {
        return user.role.name === Roles.Admin
    }
}
