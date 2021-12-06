import DBServiceInterface from "Contracts/interfaces/DBService.interface";
import DbConnectionService from "./DbConnectionService";

class DbService implements DBServiceInterface<String[]> {

    private readonly connection = DbConnectionService.getDBConnection()

    async getAllColumns(tableName: string): Promise<any> {
        return await this.connection.columnsInfo(tableName);
    }
    async getAllTables(): Promise<string[]> {
        return await this.connection.getAllTables();
    }

    async isTableExist(name: string): Promise<boolean> {
        const tables = await this.getAllTables();
        const matched = tables.filter((table) => table === name.toLowerCase()).length
        return matched > 0;
    }

    // @extraColumn: For relationship.
    async isColumnExist({ table, column, extraColumn }: { table: string, column?: string, extraColumn?: string }): Promise<boolean> {
        const columns = await this.getAllColumns(table);
        if (extraColumn) {
            return columns[extraColumn] !== null && columns[extraColumn] !== undefined;
        }
        return columns[column!] !== null && columns[column!] !== undefined;
    }

}

export default new DbService()