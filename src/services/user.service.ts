import { UserRepo, PendingUserRepo } from "../repositories";
import { NotFoundError } from "../exceptions";
import { IUser, IPendingUser } from "../interfaces";
import AuthService from "./auth.service";

class UserService {
  repo: UserRepo;
  pendingRepo: PendingUserRepo;
  auth: AuthService

  constructor() {
    this.repo = new UserRepo();
    this.pendingRepo = new PendingUserRepo();
    this.auth = new AuthService();
  }

  public async getAllPendingUsers(skip: number, limit: number): Promise<IPendingUser[]> {
    return await this.pendingRepo.getAll(skip, limit);
  }

  public async getPendingUser(email: string): Promise<IPendingUser> {
    const pendingUser = await this.pendingRepo.getOne(email);
    if (!pendingUser)
      throw new NotFoundError(`No pending user found with email ${email}`);
    return pendingUser;
  }

  public async getAllUsers(skip: number, limit: number): Promise<IUser[]> {
    return await this.repo.getAll(skip, limit);
  }

  public async getUsers(filter: object): Promise<IUser[]> {
    const users = await this.repo.where(filter);
    if (users.length < 1)
      throw new NotFoundError(`No users found with ${Object.keys(filter)}`);
    return users;
  }

  public async getOneUser(filter: object): Promise<IUser> {
    const user = await this.repo.whereOne(filter);
    if (!user) throw new NotFoundError(`No user found with ${Object.keys(filter)}`);
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
