import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";


export default interface BoolConvertHelperInterface {
    boolToInt(val?: boolean): null | 1 | 0;
}
