import { SettingsModel } from "../models";
import { ISettings } from "../interfaces";
import { ConflictError, ForbiddenError } from "../exceptions";

class SettingsRepo {
  public async get(): Promise<ISettings | null> {
    const settingsArr = await SettingsModel.find();
    if (settingsArr.length < 1)
      return null;
    return settingsArr[0];
  }

  public async update(id: string, fields: object): Promise<ISettings> {
    const updatedSettings = await SettingsModel.findByIdAndUpdate(
      id,
      fields,
      { returnDocument: "after" }
    );
    return updatedSettings;
  }

  public async create(data: ISettings): Promise<ISettings> {
    return await SettingsModel.create(data);
  }
}

export default SettingsRepo;
