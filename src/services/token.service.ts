import { IToken } from "../interfaces";
import { TokenRepo } from "../repositories";

export default class TokenService {
  repo: TokenRepo;

  constructor() {
    this.repo = new TokenRepo();
  }

  getTokens = async (environment: "test" | "live"): Promise<IToken[]> =>
    this.repo.where({ environment });

  getToken = async (address: string): Promise<IToken[]> =>
    this.repo.where({ address });
};

