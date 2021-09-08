import BoolConvertHelperInterface from "Contracts/interfaces/BoolConvertHelper.interface";

class BoolConvertHelperService implements BoolConvertHelperInterface {
    public boolToInt(val?: boolean) {
        if (val === null) return null;
        return val ? 1 : 0;
    }
}

export default new BoolConvertHelperService();
