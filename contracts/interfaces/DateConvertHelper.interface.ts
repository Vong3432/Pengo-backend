export default interface DateConvertHelperInterface {
    fromDateToReadableText(dt: number, options?: Intl.DateTimeFormatOptions): Promise<string>;
}
