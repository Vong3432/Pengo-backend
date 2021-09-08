import BoolConvertHelperInterface from "Contracts/interfaces/BoolConvertHelper.interface";

export class BoolConvertHelperService implements BoolConvertHelperInterface {
    public boolToInt(val?: boolean) {
        if (val === null) return null;
        return val ? 1 : 0;
    }
}