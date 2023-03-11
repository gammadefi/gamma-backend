import { IAdmin } from "../interfaces";
declare class AdminRepo {
    getAll(skip: number, limit: number): Promise<IAdmin[]>;
    getById(id: string): Promise<IAdmin>;
    where(fields: object): Promise<IAdmin[]>;
    whereOne(fields: object): Promise<IAdmin>;
    update(id: string, fields: object): Promise<IAdmin>;
    updateMany(filter: object, updateFields: object): Promise<IAdmin[]>;
    delete(id: string): Promise<void>;
    deleteMany(filter: object): Promise<void>;
    createUser(data: IAdmin): Promise<IAdmin>;
}
export default AdminRepo;
