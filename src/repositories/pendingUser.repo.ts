import { PendingUserModel } from "../models";
import { IPendingUser } from "../interfaces";


class PendingUserRepo {
    public async getAll(): Promise<IPendingUser[]> {
        const users = await PendingUserModel.find();
        return users;
    }

    public async getOne(email: string): Promise<IPendingUser> {
        const user = await PendingUserModel.findOne({email});
        return user;
    }

    public async update(email: string, updateFields: object): Promise<IPendingUser> {
        await PendingUserModel.findOneAndUpdate({email}, updateFields);
        const user = await this.getOne(email);
        return user;
    }

    public async delete(email: string): Promise<void> {
        await PendingUserModel.deleteOne({email});
    }

    public async create(email: string, verificationCode: string): Promise<IPendingUser> {
        return await PendingUserModel.create({email, verificationCode});
    }
}

export default PendingUserRepo;