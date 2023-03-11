import { ISettings } from "../interfaces";
declare class SettingsRepo {
    get(): Promise<ISettings | null>;
    update(id: string, fields: object): Promise<ISettings>;
    create(data: ISettings): Promise<ISettings>;
}
export default SettingsRepo;
