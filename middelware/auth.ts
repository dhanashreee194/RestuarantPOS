import { NextFunction, Request, Response } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.header("authorization");
    console.log("token ", token);
    if (!token)
      return res.status(403).json({ msg: "please provide valid auth token " });
    next();
  } catch (error) {
    console.log("token error", error);
    return res.status(500).json({ msg: "please provide valid auth token " });
  }
};
