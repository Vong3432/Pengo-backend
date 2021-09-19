import Database from '@ioc:Adonis/Lucid/Database';
import CouponNotRedeemableErrException from 'App/Exceptions/CouponNotRedeemableErrException';
import InsufficientCreditPointException from 'App/Exceptions/InsufficientCreditPointException';
import Coupon from 'App/Models/Coupon';
import CreditPoint from 'App/Models/CreditPoint';
import GooCard from 'App/Models/GooCard';
import Penger from 'App/Models/Penger';
import CouponValidateService from 'App/Services/coupon/CouponValidateService';
import { BookingItemFactory } from 'Database/factories/booking-item';
import { CouponFactory } from 'Database/factories/coupon';
import { PengerFactory } from 'Database/factories/penger';
import { UserFactory } from 'Database/factories/user';
import test from 'japa'

test.group('Testing coupon_client module', (group) => {

    let goocard: GooCard;

    group.before(async () => {
        let user = await UserFactory.with('goocard', 1).create();
        await user.load('goocard');
        goocard = user.goocard;
        // save the current state of db before testing
        await Database.beginGlobalTransaction()
    })

    group.after(async () => {
        // restore db to the state before testing
        await Database.rollbackGlobalTransaction()
    })

    test('Ensure coupon can be created', async (assert) => {
        let coupon = await CouponFactory.with('bookingItems', 1).create()
        assert.isTrue(coupon.$isPersisted)
    })

    test('Ensure invalid/unredeemable coupon will throw exception', async (assert) => {
        let factoryCoupon = await CouponFactory.with('bookingItems', 1).apply('notRedeemable').apply('outOfStock').apply('expired').create()

        try {
            if (!CouponValidateService.canRedeemed(factoryCoupon))
                throw new CouponNotRedeemableErrException("This coupon cannot be redeemed.")
        } catch (error) {
            assert.equal(error.message, "This coupon cannot be redeemed.")
        }
    })

    let cid;

    test('Ensure coupon can be redeemed', async (assert) => {

        const penger: Penger = await PengerFactory.with('coupons', 1).create()
        await penger.load('coupons')
        const coupon: Coupon = penger.coupons[0];

        const oriQuantity = coupon.quantity
        console.log(`Goocard coupon before save: ${await (await goocard.related('coupons').query()).length}`)

        await goocard.related('coupons').save(coupon);
        await coupon.merge({
            quantity: coupon.quantity > 0 ? coupon.quantity - 1 : 0
        }).save()
        await goocard.load('coupons')

        console.log(`Goocard coupon after save: ${goocard.coupons.length}`)

        cid = coupon.id;

        // add some default credit into goocard for testing
        const credit = await CreditPoint.firstOrCreate({
            gooCardId: goocard.id,
            pengerId: coupon.pengerId,
        }, {
            totalCreditPoints: 500,
            availableCreditPoints: 500
        });

        // save the credit
        credit.merge({
            totalCreditPoints: 1000,
            availableCreditPoints: 1000,
        });
        await goocard.related('creditPoints').save(credit);
        await goocard.load('creditPoints');

        // check credit 
        if (credit.availableCreditPoints === 0 ||
            credit.availableCreditPoints < coupon.minCreditPoints)
            throw new InsufficientCreditPointException("You don't have enought credit points to redeem coupon under this penger.")

        // store temp available points before deduct
        const prevAvaiCP = credit.availableCreditPoints

        // update credit
        await credit.merge({
            availableCreditPoints: credit.availableCreditPoints - coupon.minCreditPoints,
        }).save();

        assert.isTrue(
            (oriQuantity - 1) === coupon.quantity &&
            goocard.coupons.length > 0 &&
            (credit.availableCreditPoints === (prevAvaiCP - coupon.minCreditPoints))
        )
    })

    test('Ensure coupon will throw insufficient', async (assert) => {

        const penger: Penger = await PengerFactory.with('coupons', 1).create()
        await penger.load('coupons')
        const coupon: Coupon = penger.coupons[0];

        const oriQuantity = coupon.quantity
        console.log(`Goocard coupon before save: ${await (await goocard.related('coupons').query()).length}`)

        await goocard.related('coupons').save(coupon);
        await coupon.merge({
            quantity: coupon.quantity > 0 ? coupon.quantity - 1 : 0
        }).save()
        await goocard.load('coupons')

        console.log(`Goocard coupon after save: ${goocard.coupons.length}`)

        cid = coupon.id;

        // add some default credit into goocard for testing
        const credit = await CreditPoint.firstOrCreate({
            gooCardId: goocard.id,
            pengerId: coupon.pengerId,
        }, {
            totalCreditPoints: 500,
            availableCreditPoints: 500
        });

        // save the credit
        credit.merge({
            totalCreditPoints: 0,
            availableCreditPoints: 0,
        });
        await goocard.related('creditPoints').save(credit);
        await goocard.load('creditPoints');

        // check credit 
        try {
            if (credit.availableCreditPoints === 0 ||
                credit.availableCreditPoints < coupon.minCreditPoints)
                throw new InsufficientCreditPointException("You don't have enought credit points to redeem coupon under this penger.")
        } catch (error) {
            assert.equal(error.message, "You don't have enought credit points to redeem coupon under this penger.")
        }
    })

    test('Ensure coupon can be used and updated status', async (assert) => {
        await goocard.related('coupons').sync({
            [cid]: {
                is_used: true
            }
        }, false)

        const usedCoupon = await goocard.related('coupons')
            .query()
            .wherePivot('coupon_id', cid)
            .firstOrFail()

        assert.isTrue(usedCoupon.$extras.pivot_is_used === 1)
    })

})
