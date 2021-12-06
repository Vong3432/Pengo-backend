import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DpoTable from "App/Models/DpoTable";
// import { DBTransactionService } from "../db/DBTransactionService";
import AdminInterface from "Contracts/interfaces/Admin.interface"
import DbService from "../db/DbService";
import DpoTableService from "./DpoTableService";

class AdminService implements AdminInterface {
    async getAllTables({ showDuplicate }: { showDuplicate: boolean }): Promise<string[]> {
        const tables = await DbService.getAllTables();
        if (showDuplicate === true)
            return tables;

        let nonDuplicatedTables: string[] = [];

        for (const table of tables) {
            const addedTable = await DpoTable.findBy('table_name', table);

            if (addedTable === null) {
                nonDuplicatedTables.push(table)
            }
        }

        return nonDuplicatedTables
    }
    async getAllColumns({ request }: HttpContextContract): Promise<String[]> {
        const table: string = await request.param('table');
        return await DbService.getAllColumns(table);
    }

}

export default new AdminService()