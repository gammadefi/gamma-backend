import { UserModel } from "../models";
import { IUser } from "../interfaces";
// import {NotFoundError} from '../exceptions'

class UserRepo {
    public async getAll(): Promise<IUser[]> {
        const users = await UserModel.find();
        return users;
    }

    public async getById(id: string): Promise<IUser> {
        const user = await UserModel.findById(id);
        return user;
    }

    public async where(fields: object): Promise<IUser[]> {
        const users = await UserModel.find({fields})
        return users;
    }

    public async whereOne(fields: object): Promise<IUser> {
        const user = await UserModel.findOne(fields)
        return user;
    }

    public async update(id: string, fields: object): Promise<IUser> {
        await UserModel.findByIdAndUpdate(id, fields);
        const user = await this.getById(id);
        return user;
    }

    public async updateMany(filter: object, updateFields: object): Promise<IUser[]> {
        await UserModel.updateMany(filter, updateFields);
        const users = await this.where(filter);
        return users
    }

    public async delete(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id)
    }

    public async deleteMany(filter: object): Promise<void> {
        await UserModel.deleteMany(filter)
    }

    public async createUser(data: IUser): Promise<IUser> {
        return await UserModel.create(data);
    }
}

export default UserRepo