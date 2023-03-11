import { IToken } from "../interfaces";
import { TokenRepo } from "../repositories";
export default class TokenService {
    repo: TokenRepo;
    constructor();
    getTokens: (environment: "test" | "live") => Promise<IToken[]>;
    getToken: (address: string) => Promise<IToken[]>;
}
