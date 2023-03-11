import { IPendingUser } from "../interfaces";
declare class PendingUserRepo {
    getAll(skip: number, limit: number): Promise<IPendingUser[]>;
    getOne(email: string): Promise<IPendingUser>;
    update(email: string, updateFields: object): Promise<IPendingUser>;
    delete(email: string): Promise<void>;
    create(email: string, verificationCode: string, verificationExpiry: Date): Promise<IPendingUser>;
}
export default PendingUserRepo;
