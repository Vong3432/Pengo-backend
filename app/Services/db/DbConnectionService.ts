import DBConnectionInterface from "Contracts/interfaces/DBConnection.interface"
import Database from "@ioc:Adonis/Lucid/Database";

class DbConnectionService implements DBConnectionInterface {
    getDBConnection() {
        return Database.connection();
    }
}

export default new DbConnectionService()