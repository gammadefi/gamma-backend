export interface IToken {
    chainId: number,
    provider: string,
    logoURI: string,
    address: string,
    decimals: number,
    symbol: string,
    environment: "test" | "live";
}