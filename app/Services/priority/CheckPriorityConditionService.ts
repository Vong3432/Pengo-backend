import { PRIORITY_CONDITIONS } from "App/Models/PriorityOption"
import CheckPriorityConditionInterface from "Contracts/interfaces/CheckPriorityCondition.interface"

class CheckPriorityConditionService implements CheckPriorityConditionInterface {
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
        console.log(`${valToCheck} larger than ${valFromDB}`)
        return valToCheck > valFromDB;
    }
    private checkLargerEq(valFromDB: string, valToCheck: string): boolean {
        console.log(`${valToCheck} larger equal ${valFromDB}`)
        return valToCheck >= valFromDB;
    }
    private checkLesser(valFromDB: string, valToCheck: string): boolean {
        console.log(`${valToCheck} lesser than ${valFromDB}`)
        return valToCheck < valFromDB;
    }
    private checkLesserEq(valFromDB: string, valToCheck: string): boolean {
        console.log(`${valToCheck} lesser equal ${valFromDB}`)
        return valToCheck <= valFromDB;
    }
}

export default new CheckPriorityConditionService()