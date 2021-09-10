import { QueryClientContract } from "@ioc:Adonis/Lucid/Database";

export default interface DbConnectionInterface {
    getDBConnection(): QueryClientContract;
}
