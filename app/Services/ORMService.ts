import { BaseModel } from "@ioc:Adonis/Lucid/Orm";

type ModelType = typeof BaseModel;

export default class ORMService {

    private model: typeof BaseModel;

    constructor(model: ModelType) {
        this.model = model;
    }

    getModel(): ModelType { return this.model };
}

export class ORMFilterService extends ORMService {

    private cols: Record<string, any>;

    constructor(model: ModelType, cols: Record<string, any>) {
        super(model);
        this.cols = cols;
    }

    async getFilteredResults() {
        if (Object.keys(this.cols).length === 0)
            return await this.getModel().all();

        let keyArrays: string[] = [];
        let valArrays: string[] = [];

        for (const [key, value] of Object.entries(this.cols)) {
            keyArrays.push(key)
            valArrays.push(value)
        }

        return await this.getModel()
            .query()
            .whereIn(keyArrays, [valArrays])
    }
}