import { AdminRepo } from "../repositories";
import { NotFoundError } from "../exceptions";
import { IAdmin } from "../interfaces";

class AdminService {
  repo: AdminRepo;

  constructor() {
    this.repo = new AdminRepo();
  }


  public async getAllAdmins(skip: number, limit: number): Promise<IAdmin[]> {
    return await this.repo.getAll(skip, limit);
  }

  public async getAdmin(filter: object): Promise<IAdmin[]> {
    const admins = await this.repo.where(filter);
    if (admins.length < 1)
      throw new NotFoundError(`No admins found with ${Object.keys(filter)}`);
    return admins;
  }

  public async getOneAdmin(filter: object): Promise<IAdmin> {
    const admin = await this.repo.whereOne(filter);
    if (!admin)
      throw new NotFoundError(`No admin found with ${Object.keys(filter)}`);
    return admin;
  }

  public async getAdminById(id: string): Promise<IAdmin> {
    const admin = await this.repo.getById(id);
    if (!admin) throw new NotFoundError(`No admin found with id ${id}`);
    return admin;
  }

  public async updateAdmin(id: string, fields: object): Promise<IAdmin> {
    const admin = await this.repo.update(id, fields);
    if (!admin) throw new NotFoundError(`No admin found with id ${id}`);
    return admin;
  }

  public async updateAdmins(filter: object, fields: object): Promise<IAdmin[]> {
    const admins = await this.repo.updateMany(filter, fields);
    if (admins.length < 1)
      throw new NotFoundError(`No admin found with ${filter}`);
    return admins;
  }
}

export default AdminService;
