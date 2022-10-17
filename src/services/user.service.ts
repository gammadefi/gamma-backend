import { UserRepo, PendingUserRepo } from "../repositories";
import { NotFoundError } from "../exceptions";
import { IUser, IPendingUser } from "../interfaces";

class UserService {
  repo: UserRepo;
  pendingRepo: PendingUserRepo;

  constructor() {
    this.repo = new UserRepo();
    this.pendingRepo = new PendingUserRepo();
  }

  public async getAllPendingUsers(): Promise<IPendingUser[]> {
    return await this.pendingRepo.getAll();
  }

  public async getPendingUser(email: string): Promise<IPendingUser> {
    const pendingUser = await this.pendingRepo.getOne(email);
    if (!pendingUser) throw new NotFoundError(`No pending user found with email ${email}`);
    return pendingUser;
  }

  public async getAllUsers(): Promise<IUser[]> {
    return await this.repo.getAll();
  }

  public async getUsers(filter: object): Promise<IUser[]> {
    const users = await this.repo.where(filter);
    if (users.length < 1)
      throw new NotFoundError(`No users found with ${filter}`);
    return users;
  }

  public async getOneUser(filter: object): Promise<IUser> {
    const user = await this.repo.whereOne(filter);
    if (!user) throw new NotFoundError(`No user found with ${filter}`);
    return user;
  }

  public async getUserById(id: string): Promise<IUser> {
    const user = await this.repo.getById(id);
    if (!user) throw new NotFoundError(`No user found with id ${id}`);
    return user;
  }

  public async updateUser(id: string, fields: object): Promise<IUser> {
    const user = await this.repo.update(id, fields);
    if (!user) throw new NotFoundError(`No user found with id ${id}`);
    return user;
  }

  public async updateUsers(filter: object, fields: object): Promise<IUser[]> {
    const users = await this.repo.updateMany(filter, fields);
    if (users.length < 1)
      throw new NotFoundError(`No user found with ${filter}`);
    return users;
  }
}

export default UserService;
