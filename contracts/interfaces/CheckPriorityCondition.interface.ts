import { PRIORITY_CONDITIONS } from "App/Models/PriorityOption";

export default interface CheckPriorityConditionInterface {
    validateCondition(valFromDB: string, valToCheck: string, condition: PRIORITY_CONDITIONS): boolean;
}
