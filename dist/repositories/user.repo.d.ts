import { IUser } from "../interfaces";
declare class UserRepo {
    getAll(skip: number, limit: number): Promise<IUser[]>;
    getById(id: string): Promise<IUser>;
    where(fields: object): Promise<IUser[]>;
    whereOne(fields: object): Promise<IUser>;
    update(id: string, fields: object): Promise<IUser>;
    updateMany(filter: object, updateFields: object): Promise<IUser[]>;
    delete(id: string): Promise<void>;
    deleteMany(filter: object): Promise<void>;
    createUser(data: IUser): Promise<IUser>;
}
export default UserRepo;
