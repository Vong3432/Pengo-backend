import DateCheckHelperInterface from "Contracts/interfaces/DateCheckHelper.interface"

class DateCheckHelperService implements DateCheckHelperInterface {
    isCurrentOverTargetISO({targetIso, currentIso}: {targetIso: string, currentIso: string}): boolean {
        return currentIso > targetIso
    }
}

export default new DateCheckHelperService()