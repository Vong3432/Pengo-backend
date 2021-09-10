export default interface DBServiceInterface<T> {
    getAllTables(): Promise<T>;
    getAllColumns(table: string): Promise<T>;
    isTableExist(name: string): Promise<boolean>;
    isColumnExist({ table, column }: { table: string, column: string }): Promise<boolean>;
}
