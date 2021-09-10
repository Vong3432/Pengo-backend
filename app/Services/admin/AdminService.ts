import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
// import { DBTransactionService } from "../db/DBTransactionService";
import AdminInterface from "Contracts/interfaces/Admin.interface"
import DbService from "../db/DbService";

class AdminService implements AdminInterface {
    async getAllTables(): Promise<String[]> {
        return await DbService.getAllTables();
    }
    async getAllColumns({ request }: HttpContextContract): Promise<String[]> {
        const table: string = await request.param('table');
        return await DbService.getAllColumns(table);
    }

}

export default new AdminService()