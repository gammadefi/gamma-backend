import { AdminRepo, SettingsRepo } from "../repositories";
import { IAdmin, ISettings } from "../interfaces";
declare class SettingsService {
    repo: SettingsRepo;
    adminRepo: AdminRepo;
    constructor();
    getSettings(): Promise<ISettings>;
    updateSettings(fields: object, admin: IAdmin): Promise<ISettings>;
    createSettings(data: ISettings): Promise<ISettings>;
}
export default SettingsService;
