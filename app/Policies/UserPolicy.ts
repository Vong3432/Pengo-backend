import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Penger from 'App/Models/Penger';
import Role, { Roles } from 'App/Models/Role';
import User from 'App/Models/User';

export default class UserPolicy extends BasePolicy {
    public async isPenger(user: User) {
        return user.role.name === Roles.Staff
            || user.role.name === Roles.Founder
    }

    public async isFounder(user: User) {
        return user.role.name === Roles.Founder
    }

    public async canPerformActionOnPenger(user: User, penger: Penger) {
        return await penger.related('pengerUsers').query().wherePivot('user_id', user.id)
            .first() != null
            ? true
            : false;
    }
}
