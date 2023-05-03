import { NextFunction, Request, Response } from "express";
import { adminApp } from "../firebase";
import logging from "../config/logging";
import { isAuthorized } from "./authorization_check";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.header("authorization");
    // console.log("token ", token);
    if (!token)
      return res.status(403).json({ msg: "please provide valid auth token " });
    adminApp
      .auth()
      .verifyIdToken(token)
      .then((claims: any) => {
        console.log("clams  ", claims);

        const request_uri = req.path;
        const request_method = req.method;

        console.log(request_uri);
        if (
          isAuthorized({
            uri_path: request_uri,
            role: claims?.role,
            employeeRole: claims?.employeeRole,
            isAdminAccess: claims?.admin,
            request_method,
          })
        ) {
          req.body.user = claims;
          next();
        } else {
          return res.status(401).json({ msg: "You are not Authorized" });
        }
      })
      .catch((err: any) => {
        logging.error("Authorization", "token err", err);
        return res
          .status(401)
          .json({ msg: "please provide valid auth token " });
      });
  } catch (error) {
    logging.error("Authorization", "token error", error);
    return res.status(500).json({ msg: "please provide valid auth token " });
  }
};
