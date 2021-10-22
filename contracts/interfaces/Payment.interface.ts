export default interface PaymentInterface {
    withdraw<T>(from: string, to: string, amount: number, extra?: {}): Promise<T>
    deposit<T>(cusId: string, amount: number, extra?: {}): Promise<T>
}
