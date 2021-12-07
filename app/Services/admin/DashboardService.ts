import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import BookingItem from "App/Models/BookingItem";
import Role, { Roles } from "App/Models/Role";
import User from "App/Models/User";
import DashboardInterface from "Contracts/interfaces/Dashboard.interface"
import { DateTime } from "luxon";
import RateService from "../helpers/RateService";

interface DashboardDataStat {
    value: number;
    rate: number
}

interface DashboardData {
    // transactionStat: {
    //     today: DashboardDataStat
    // }
    userStat: {
        total: DashboardDataStat;
        newPengoo: DashboardDataStat;
        newPenger: DashboardDataStat;
    }
}

interface DashboardBookingData {
    yearlyData: number[],
    rate: number;
}

interface DashboardCommissionAndItemData {
    commissionData: number[],
    commissionStat: {
        currency: string;
        value: number;
    },
    itemStat: {
        value: number;
    }
}

class DashboardService implements DashboardInterface {
    async getStats({ logger }: HttpContextContract): Promise<DashboardData> {

        // exclude admin
        const rolesIdWithoutAdmin = (await Role.query().where('name', '!=', Roles.Admin)).map((role) => role.id)
        const pengooRoleId = (await Role.query().where('name', Roles.Pengoo).firstOrFail()).id
        const pengerRoleId = (await Role.query().whereIn('name', [Roles.Founder, Roles.Staff])).map((role) => role.id)

        // current week
        const currentYear = DateTime.now().year
        const currentWeek = DateTime.now().weekNumber

        // group user by week
        const userWeeklyArr = await this.getGroupedRecord({ tableName: 'users', column: 'created_at', type: 'week' }).whereIn('role_id', rolesIdWithoutAdmin)
        const pengooWeeklyArr = await this.getGroupedRecord({ tableName: 'users', column: 'created_at', type: 'week' }).where('role_id', pengooRoleId)
        const pengerWeeklyArr = await this.getGroupedRecord({ tableName: 'users', column: 'created_at', type: 'week' }).whereIn('role_id', pengerRoleId)

        // stat data
        let totalThisWeekUsers: number = 0
        let totalThisWeekPengoo: number = 0
        let totalThisWeekPengers: number = 0

        // sum total users and get rate
        const totalUsers = userWeeklyArr.reduce((accum: number, currUserData): number => {
            if (currUserData.week === currentWeek) {
                totalThisWeekUsers = currUserData.totalRecord
            }
            return accum + currUserData.totalRecord
        }, 0)
        const totalUsersRateByWeek = RateService.getRate({ latestVal: totalUsers, startingVal: (totalUsers - totalThisWeekUsers) })

        // sum total pengoo and get rate
        const totalPengoo = pengooWeeklyArr.reduce((accum: number, currUserData): number => {
            if (currUserData.week === currentWeek) {
                totalThisWeekPengoo = currUserData.totalRecord
            }
            return accum + currUserData.totalRecord
        }, 0)
        const totalPengooRateByWeek = RateService.getRate({ latestVal: totalPengoo, startingVal: (totalPengoo - totalThisWeekPengoo) })

        // sum total pengers and get rate
        const totalPenger = pengerWeeklyArr.reduce((accum: number, currUserData): number => {
            if (currUserData.week === currentWeek) {
                totalThisWeekPengers = currUserData.totalRecord
            }
            return accum + currUserData.totalRecord
        }, 0)
        const totalPengerRateByWeek = RateService.getRate({ latestVal: totalPenger, startingVal: (totalPenger - totalThisWeekPengers) })

        // logging
        logger.info(`Current year: ${currentYear}`)
        logger.info(`Current week: ${currentWeek}`)
        logger.info(`Total users: ${totalUsers}`)
        logger.info(`Rate in total users(%): ${totalUsersRateByWeek}%`)
        logger.info(`New pengoo(weekly): ${totalThisWeekPengoo}`)
        logger.info(`Rate in new pengoo(%): ${totalPengooRateByWeek}%`)
        logger.info(`New penger(weekly): ${totalThisWeekPengers}`)
        logger.info(`Rate in new penger(%): ${totalPengerRateByWeek}%`)
        logger.info(`User weekly group data: ${JSON.stringify(userWeeklyArr)}`)
        logger.info(`Pengoo weekly group data: ${JSON.stringify(pengooWeeklyArr)}`)
        logger.info(`Penger weekly group data: ${JSON.stringify(pengerWeeklyArr)}`)

        return {
            userStat: {
                total: {
                    value: totalUsers,
                    rate: parseFloat(totalUsersRateByWeek.toFixed(2)) * 100,
                },
                newPengoo: {
                    value: totalThisWeekPengoo,
                    rate: parseFloat(totalPengooRateByWeek.toFixed(2)) * 100,
                },
                newPenger: {
                    value: totalThisWeekPengers,
                    rate: parseFloat(totalPengerRateByWeek.toFixed(2)) * 100,
                },
            }
        }
    };

    async getBookingData({ request, logger }: HttpContextContract): Promise<DashboardBookingData> {

        // 12-month default data
        let defaultData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        const yearlyArr = await this.getGroupedRecord({ tableName: 'booking_records', column: 'created_at', type: 'year' })

        const currentYear = DateTime.now().year
        let totalThisYearRecords = 0;
        const totalPastYearRecords = yearlyArr
            .filter((yearData) => {
                if (yearData.year === currentYear) {
                    totalThisYearRecords = yearData.totalRecord
                }
                return yearData.year !== currentYear
            })
            .reduce((accum: number, currYearData): number => {
                return accum += currYearData.totalRecord
            }, 0)

        const rate = RateService.getRate({ latestVal: totalThisYearRecords, startingVal: totalPastYearRecords })

        logger.info(`All records in past year: ${totalPastYearRecords}`)
        logger.info(`All records in this year: ${totalThisYearRecords}`)
        logger.info(`Rate: ${rate}`)

        const monthlyArr = await this.getGroupedRecord({ tableName: 'booking_records', column: 'created_at', type: 'month' })

        // upsert data to defaultData array
        for (const monthData of monthlyArr) {
            defaultData[monthData.month - 1] = monthData.totalRecord
        }

        return {
            yearlyData: defaultData,
            rate: parseFloat(rate.toFixed(2)) * 100
        }
    }

    async getCommissionAndItemsData({ request }: HttpContextContract): Promise<DashboardCommissionAndItemData> {

        // 12-month default data
        let defaultData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let totalCommission = 0

        const monthlyArr = await this.getGroupedRecord({ tableName: 'transactions', column: 'created_at', type: 'month' }).where('is_paid', '0').sum("amount as totalAmount")


        // upsert data to defaultData array
        for (const monthData of monthlyArr) {
            const totalAmountInThisMonth = parseFloat((monthData.totalAmount / 100).toFixed(2))
            totalCommission += totalAmountInThisMonth
            defaultData[monthData.month - 1] = totalAmountInThisMonth
        }

        // items
        const items = await BookingItem.query()

        return {
            commissionData: defaultData,
            commissionStat: {
                currency: "RM",
                value: totalCommission,
            },
            itemStat: {
                value: items.length,
            }
        }
    }

    /**
     * Get all data group by month | year | week
     *  
     * Example: [
     *  RowDataPacket { [month | year | week]: 11, totalRecord: 4 },
     *  RowDataPacket { [month | year | week]: 12, totalRecord: 1 }
     * ]
     * 
     */
    getGroupedRecord({ tableName, column, type }: { tableName: string, column: string, type: 'year' | 'month' | 'week' }) {
        return Database
            .from(tableName)
            .select(
                [
                    Database.raw(`${type}(${column}) as ${type}`),
                    Database.raw(`COUNT(*) as totalRecord`),
                ]
            )
            .groupBy(type)
    }
}

export default new DashboardService()