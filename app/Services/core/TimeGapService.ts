import TimeGapInterface from "Contracts/interfaces/TimeGap.interface"
import { TimeGapUnit } from "Config/const";

class TimeGapService implements TimeGapInterface {
    getTimeUnits(): TimeGapUnit[] {
        return [
            TimeGapUnit.HOURS,
            TimeGapUnit.MINUTES,
            // TimeGapUnit.SECONDS (!) Abandoned
        ]
    }
}

export default new TimeGapService()