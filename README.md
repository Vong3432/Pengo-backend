## run test by file
```
npm run test --file=test/user.spec.ts
```

## API Documentations

#### Admin
https://documenter.getpostman.com/view/7274101/UVC3k7va

#### Auth
https://documenter.getpostman.com/view/7274101/UVC3k7vb

#### Google Map
https://documenter.getpostman.com/view/7274101/UVC3k7vc

#### Penger
https://documenter.getpostman.com/view/7274101/UVC3k7vd

#### Pengoo
https://documenter.getpostman.com/view/7274101/UVC3k7ve

## Features Checklist

### Pengo
---

#### Booking record

- [x]  Booking pass verification using socket.
- [x]  Stripe payment gateway.
- [x]  Book item
    - [x]  Validate goocard before book
- [x]  View records
    - [ ]  Calendar
        - [x]  Filter through calendar
- [x]  View record
    - [x]  View booking queue info
- [x]  Cancel booking

#### Goocard

- [x]  Pin verification
- [x]  Save logs
- [x]  Read logs

#### Coupon

- [ ]  Coupon verification using socket. (?)
    - [x]  Redeem manually
    - [ ]  ~~Redeem by qr code~~
- [x]  View coupons
    - [x]  Filter coupons
- [x]  Redeem coupon
    - [x]  Validate date and time during redeem
    - [x]  Credit points is calculated based on the relationship between Penger and Pengoo
        - eg: John Doe has 1000 credit points in PengerA, and 100 credit points in PengerB, but the credit points in PengerB cannot be included and consumed in PengerA.

#### Penger list

- [x]  Search function
    - [x]  Automatically show possible results when Pengoo is typing.
- [x]  Filter function
    - [x]  Sort by relevance, distance, date.
    - [x]  Based on radius
    - [x]  Based on price
- [x]  Prevent user from booking date which is between the close date range defined by Penger.

#### Profile

- [ ]  Profile overview
- [ ]  Email verification
- [ ]  ~~Reward~~
    - [ ]  ~~View the coupons from Penger that current Pengoo has booked before.~~
- [ ]  User preferences setting

#### Feedback

- [ ]  Write review to record by item
- [ ]  Report to system
- [ ]  View reviews of a item

#### Utility

- [ ]  ~~In-app share (deep link)~~
- [x]  Location
    - [x]  Calculate distance.
    - [x]  Save location
    - [x]  Grab user's favourite location if have, otherwise grab device location (ask permission). If users deny location, make sure app does not crash.

### Penger
---

#### Profile

- [ ]  Profile overview

#### Booking records

- [x]  Scan pass from Pengoo and mark as used.
- [ ]  ~~Approve/reject cancel booking from Pengoo.~~
- [x]  Verify manually
- [ ]  ~~Cancel booking record directly.~~
- [x]  View records
- [x]  View record detail

#### Booking item

- [x]  CRUD booking item.
    - [ ]  ~~sidenote: time haven't added~~
- [x]  Dynamic configuration for preserve booking
- [x]  Validate isActive is working.
- [x]  Filter function
    - [x]  Filter by category
    - [x]  Filter by name

#### Booking category

- [x]  Create, edit, read booking category
- [x]  Configure system functions that is set by admin for category.
- [x]  Validate isActive is working.

#### Coupons

- [x]  CRUD coupons
- [ ]  ~~Scan pass from Pengoo and mark as used (?)~~
    - [x]  Configuration for scanning or during booking
- [x]  Set coupons to specific items
- [x]  Validate isActive is working.

#### Penger management

- [x]  Sign up
- [x]  Founder/staff can CRUD organisation.
    - [ ]  If is staff, have to wait for founder permission.
- [x]  Penger can select current organisation from list.
- [x]  Set close time for
    - [x]  Penger
    - [ ]  ~~Booking categories~~
    - [ ]  ~~Booking items~~

#### Staff management

- [x]  Founder can CRUD staff.
- [ ]  Staff can request leave

#### Payment

- [x]  Setup stripe
- [x]  Request payout
- [x]  View history
- [x]  View total payout, charges
    - Update metadata(include current charge rate) transactions table when payout [https://stripe.com/docs/api/payment_intents/update](https://stripe.com/docs/api/payment_intents/update)

### Admin
---

#### Define Priority Col
- [x]  CRUD

#### Define Priority Table
- [x]  CRUD

#### Setting
- [ ]  Charge rate