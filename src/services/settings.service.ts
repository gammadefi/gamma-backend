import { AdminRepo, SettingsRepo } from "../repositories";
import { IAdmin, ISettings } from "../interfaces";
import { ConflictError, ForbiddenError } from "../exceptions";
import moment from "moment";
import { AdminAction } from "../types";

class SettingsService {
  repo: SettingsRepo;
  adminRepo: AdminRepo;

  constructor() {
    this.repo = new SettingsRepo();
    this.adminRepo = new AdminRepo();
  }

  public async getSettings(): Promise<ISettings> {
    const settings = await this.repo.get();
    if (!settings) throw new ConflictError(`No settings defined yet!`);
    return settings;
  }

  public async updateSettings(
    fields: object,
    admin: IAdmin
  ): Promise<ISettings> {
    const settings = (await this.getSettings()) as any;

    const updatedSettings = this.repo.update(settings._id, fields);

    const timeOfUpdate = moment().toString();

    // Construct admin action objects
    const actions = admin.actions;
    Object.keys(fields).map((key) => {
      // Looping through updated fields to construct admin actions
      actions.push({
        field: key,
        previous: settings[key],
        updatedTo: fields[key],
        updateTime: timeOfUpdate,
      });
    });

    // Update admin because of new actions added
    await this.adminRepo.update(admin._id, { actions });

    return updatedSettings;
  }

  public async createSettings(data: ISettings): Promise<ISettings> {
    const settings = await this.repo.get();
    if (settings)
      throw new ForbiddenError(`Predefined settings already exist!`);
    return await this.repo.create(data);
  }
}

export default SettingsService;
