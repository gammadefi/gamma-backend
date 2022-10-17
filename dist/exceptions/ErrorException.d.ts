import { Request, Response, NextFunction } from 'express';
declare const errHandler: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default errHandler;
