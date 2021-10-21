import { PRIORITY_CONDITIONS } from "App/Models/PriorityOption"
import CheckPriorityConditionInterface from "Contracts/interfaces/CheckPriorityCondition.interface"

class CheckPriorityConditionService implements CheckPriorityConditionInterface {

    /**
     * valFromDB - check value from user
     * valToCheck - value that set by penger
    */
    validateCondition(valFromDB: string, valToCheck: string, condition: PRIORITY_CONDITIONS): boolean {
        let result: boolean = false;
        switch (condition) {
            case PRIORITY_CONDITIONS.EQUAL:
                result = this.checkEquality(valFromDB, valToCheck);
                break;
            case PRIORITY_CONDITIONS.LARGER:
                result = this.checkLarger(valFromDB, valToCheck);
                break;
            case PRIORITY_CONDITIONS.LARGER_EQUAL:
                result = this.checkLargerEq(valFromDB, valToCheck);
                break;
            case PRIORITY_CONDITIONS.LESSER:
                result = this.checkLesser(valFromDB, valToCheck);
                break;
            case PRIORITY_CONDITIONS.LESSER_EQUAL:
                result = this.checkLesserEq(valFromDB, valToCheck);
                break;
            default:
                break;
        }
        return result;
    }

    private checkEquality(valFromDB: string, valToCheck: string): boolean {
        console.log(`${valToCheck} === ${valFromDB}`)
        return valFromDB.toString() === valToCheck;
    }
    private checkLarger(valFromDB: string, valToCheck: string): boolean {
        console.log(`${valFromDB} larger than ${valToCheck}`)
        return valFromDB > valToCheck;
    }
    private checkLargerEq(valFromDB: string, valToCheck: string): boolean {
        console.log(`${valFromDB} larger equal ${valToCheck}`)
        return valFromDB >= valToCheck;
    }
    private checkLesser(valFromDB: string, valToCheck: string): boolean {
        console.log(`${valFromDB} lesser than ${valToCheck}`)
        return valFromDB < valToCheck;
    }
    private checkLesserEq(valFromDB: string, valToCheck: string): boolean {
        console.log(`${valFromDB} lesser equal ${valToCheck}`)
        return valFromDB <= valToCheck;
    }
}

export default new CheckPriorityConditionService()