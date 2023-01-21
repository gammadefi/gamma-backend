export interface TransferNativeITF {
    privateKey : string, 
    toAddress: string, 
    fromAddress : string,
    amount : string
}

export interface PromiseITF {
    status: string,
    message:string,
    hash? : any
}