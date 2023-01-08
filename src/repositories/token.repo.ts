import { TokenModel } from "../models";
import { IToken } from "../interfaces";

class TokenRepo {
  public async getAll(skip: number, limit: number): Promise<IToken[]> {
    const users = await TokenModel.find().skip(skip).limit(limit);
    //   .select("-refreshTokens", "-password", "-devices");
    return users;
  }

  public async getById(id: string): Promise<IToken> {
    const user = await TokenModel.findById(id);
    return user;
  }

  public async where(fields: object): Promise<IToken[]> {
    const users = await TokenModel.find({ fields });
    return users;
  }

  public async whereOne(fields: object): Promise<IToken> {
    const user = await TokenModel.findOne(fields);
    return user;
  }

  public async update(id: string, fields: object): Promise<IToken> {
    await TokenModel.findByIdAndUpdate(id, fields);
    const user = await this.getById(id);
    return user;
  }

  public async updateMany(
    filter: object,
    updateFields: object
  ): Promise<IToken[]> {
    await TokenModel.updateMany(filter, updateFields);
    const users = await this.where(filter);
    return users;
  }

  public async delete(id: string): Promise<void> {
    await TokenModel.findByIdAndDelete(id);
  }

  public async deleteMany(filter: object): Promise<void> {
    await TokenModel.deleteMany(filter);
  }

  public async createUser(data: IToken): Promise<IToken> {
    return await TokenModel.create(data);
  }
}

export default TokenRepo;
