import RateInterface from "Contracts/interfaces/Rate.interface"

class RateService implements RateInterface {

    /**
     * Calculate and get rate between 2 numbers
     * 
     * Formula: 
     * (ending value) / (starting value) = result - 1 
     * 
     * @param latestVal: number
     * @param startingVal: number
     * 
     * @returns rate (eg: 1 = 100%, 0.2 = 20%, -0.5 = -50%)
     * 
     */
    getRate({ latestVal, startingVal }: { latestVal: number, startingVal: number }) {
        console.log(`Latest: ${latestVal}`)
        console.log(`Starting: ${startingVal}`)
        const rate = startingVal === 0 ? 1 : (latestVal / startingVal) - 1
        return rate;
    }
}

export default new RateService()