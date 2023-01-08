import { Model } from "mongoose";
import PendingUserRepo from "./pendingUser.repo";
import UserRepo from "./user.repo";
import TokenRepo from "./token.repo";

export {
    PendingUserRepo,
    UserRepo,
    TokenRepo
}

// class UserRepo {
//     itf: any
//     model: Model<any>;

//     constructor (itf: Interface, model: Model<any>) {
//         this.model = model;
//         this.itf = itf;
//     }


//   public async getAll(skip: number, limit: number): Promise<IUser[]> {
//     const users = await this.model.find().skip(skip).limit(limit);
//     //   .select("-refreshTokens", "-password", "-devices");
//     return users;
//   }

//   public async getById(id: string): Promise<IUser> {
//     const user = await this.model.findById(id);
//     return user;
//   }

//   public async where(fields: object): Promise<IUser[]> {
//     const users = await this.model.find({ fields });
//     return users;
//   }

//   public async whereOne(fields: object): Promise<IUser> {
//     const user = await this.model.findOne(fields);
//     return user;
//   }

//   public async update(id: string, fields: object): Promise<IUser> {
//     await this.model.findByIdAndUpdate(id, fields);
//     const user = await this.getById(id);
//     return user;
//   }

//   public async updateMany(
//     filter: object,
//     updateFields: object
//   ): Promise<IUser[]> {
//     await this.model.updateMany(filter, updateFields);
//     const users = await this.where(filter);
//     return users;
//   }

//   public async delete(id: string): Promise<void> {
//     await this.model.findByIdAndDelete(id);
//   }

//   public async deleteMany(filter: object): Promise<void> {
//     await this.model.deleteMany(filter);
//   }

//   public async createUser(data: IUser): Promise<IUser> {
//     return await this.model.create(data);
//   }
// }

// // export default UserRepo;