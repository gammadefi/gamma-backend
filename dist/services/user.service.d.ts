import { UserRepo, PendingUserRepo } from "../repositories";
import { IUser, IPendingUser } from "../interfaces";
import AuthService from "./auth.service";
declare class UserService {
    repo: UserRepo;
    pendingRepo: PendingUserRepo;
    auth: AuthService;
    constructor();
    getAllPendingUsers(skip: number, limit: number): Promise<IPendingUser[]>;
    getPendingUser(email: string): Promise<IPendingUser>;
    getAllUsers(skip: number, limit: number): Promise<IUser[]>;
    getUsers(filter: object): Promise<IUser[]>;
    getOneUser(filter: object): Promise<IUser>;
    getUserById(id: string): Promise<IUser>;
    updateUser(id: string, fields: object): Promise<IUser>;
    updateUsers(filter: object, fields: object): Promise<IUser[]>;
}
export default UserService;
