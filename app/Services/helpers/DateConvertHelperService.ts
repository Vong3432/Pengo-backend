import DateConvertHelperInterface from "Contracts/interfaces/DateConvertHelper.interface"

class DateConvertHelperService implements DateConvertHelperInterface {
    fromDateToReadableText(dt: number, option?: Intl.DateTimeFormatOptions): Promise<string> {
        try {
            let s = new Intl.DateTimeFormat('en-MY', {
                dateStyle: option?.dateStyle,
                timeStyle: option?.timeStyle,
            }).format(dt)

            return Promise.resolve(s);
        } catch (error) {
            return Promise.reject('Please ensure date format is correct.');
        }
    }

}

export default new DateConvertHelperService();
