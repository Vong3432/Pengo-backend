export default interface DateCheckHelperInterface {
    isCurrentOverTargetISO({targetIso, currentIso}: {targetIso: string, currentIso: string}): boolean
}
