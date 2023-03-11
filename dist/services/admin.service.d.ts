import { AdminRepo } from "../repositories";
import { IAdmin } from "../interfaces";
declare class AdminService {
    repo: AdminRepo;
    constructor();
    getAllAdmins(skip: number, limit: number): Promise<IAdmin[]>;
    getAdmin(filter: object): Promise<IAdmin[]>;
    getOneAdmin(filter: object): Promise<IAdmin>;
    getAdminById(id: string): Promise<IAdmin>;
    updateAdmin(id: string, fields: object): Promise<IAdmin>;
    updateAdmins(filter: object, fields: object): Promise<IAdmin[]>;
}
export default AdminService;
