import { AdminModel } from "../models";
import { IAdmin } from "../interfaces";
// import {NotFoundError} from '../exceptions'

class AdminRepo {
  public async getAll(skip: number, limit: number): Promise<IAdmin[]> {
    const admins = await AdminModel.find().skip(skip).limit(limit);
    //   .select("-refreshTokens", "-password", "-devices");
    return admins;
  }

  public async getById(id: string): Promise<IAdmin> {
    const admin = await AdminModel.findById(id);
    return admin;
  }

  public async where(fields: object): Promise<IAdmin[]> {
    const admins = await AdminModel.find({ fields });
    return admins;
  }

  public async whereOne(fields: object): Promise<IAdmin> {
    const admin = await AdminModel.findOne(fields);
    return admin;
  }

  public async update(id: string, fields: object): Promise<IAdmin> {
    const admin = await AdminModel.findByIdAndUpdate(id, fields, {
      returnDocument: "after",
    });
    // const admin = await this.getById(id);
    return admin;
  }

  public async updateMany(
    filter: object,
    updateFields: object
  ): Promise<IAdmin[]> {
    await AdminModel.updateMany(filter, updateFields);
    const users = await this.where(filter);
    return users;
  }

  public async delete(id: string): Promise<void> {
    await AdminModel.findByIdAndDelete(id);
  }

  public async deleteMany(filter: object): Promise<void> {
    await AdminModel.deleteMany(filter);
  }

  public async createUser(data: IAdmin): Promise<IAdmin> {
    return await AdminModel.create(data);
  }
}

export default AdminRepo;
