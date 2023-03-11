import { IToken } from "../interfaces";
declare class TokenRepo {
    getAll(skip: number, limit: number): Promise<IToken[]>;
    getById(id: string): Promise<IToken>;
    where(fields: object): Promise<IToken[]>;
    whereOne(fields: object): Promise<IToken>;
    update(id: string, fields: object): Promise<IToken>;
    updateMany(filter: object, updateFields: object): Promise<IToken[]>;
    delete(id: string): Promise<void>;
    deleteMany(filter: object): Promise<void>;
    createUser(data: IToken): Promise<IToken>;
}
export default TokenRepo;
