import { Request, Response } from "express";
import { UserRecord, getAuth } from "firebase-admin/auth";
import logging from "../../config/logging";
import User from "../../models/User";
import { IUser } from "../../interfaces/IUser";
import { adminApp } from "../../firebase";
import { responseObj } from "../../helper/response";
import { HTTP_RESPONSE } from "../../helper/constants";
import { EMOPLOYEE_ROLES, USER_ROLES } from "../../config/enums";

export const addUser = async (req: Request, res: Response) => {
  try {
    const {
      displayName = "",
      email = "",
      password = "",
      employeeRole = EMOPLOYEE_ROLES.DEFAULT,
    }: IUser = req.body;

    if (employeeRole != EMOPLOYEE_ROLES.DEFAULT)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "Hey you are tying to add employee role, please use employee route instead.",
        error: null,
        resObj: res,
        data: null,
      });

    if (displayName == "" || email == "" || password == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide email, name and password",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const newUserRecord = await addUserToFirebase(req.body);
    const isAdded = await addUserToMongoDB({
      ...req.body,
      uid: newUserRecord.uid,
    });

    if (!isAdded) {
      await deleteUserFromFirebase(newUserRecord.uid);
      return responseObj({
        statusCode: HTTP_RESPONSE.ACCEPTED,
        type: "error",
        msg: "unable to add user to MongoDB",
        error: null,
        resObj: res,
        data: null,
      });
    }

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "user added successfully ",
      error: null,
      resObj: res,
      data: newUserRecord,
    });
  } catch (error: any) {
    logging.error("Add User", "unable to add user", error);
    if (error?.message)
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: error?.message || "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const deleteUserFromFirebase = async (uid: string) => {
  await getAuth(adminApp).deleteUser(uid);
};
export const addUserToFirebase = async ({
  displayName,
  email,
  emailVerified = false,
  photoURL,
  password,
  phoneNumber,
  role = USER_ROLES.DEFAULT,
  isAdminAccess = false,
  employeeRole = EMOPLOYEE_ROLES.DEFAULT,
}: IUser) => {
  const newUserRecord = await getAuth(adminApp).createUser({
    email,
    emailVerified,
    phoneNumber,
    password,
    displayName,
    photoURL,
  });

  if (role != USER_ROLES.DEFAULT)
    await getAuth(adminApp).setCustomUserClaims(newUserRecord.uid, {
      role: role,
      admin: isAdminAccess,
      employeeRole,
    });
  return newUserRecord;
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { pageToken } = req.params;
    const usersList = await getAuth(adminApp).listUsers(1000, pageToken);
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "user added successfully ",
      error: null,
      resObj: res,
      data: usersList,
    });
  } catch (err) {
    logging.error("Get Users", "unable to get users", err);
    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const getUser = (req: Request, res: Response) => {
  return responseObj({
    statusCode: HTTP_RESPONSE.SUCCESS,
    type: "error",
    msg: "unable to add user to MongoDB",
    error: null,
    resObj: res,
    data: req.body,
  });
};

// to add user to mongo database
export const addUserToMongoDB = async (data: IUser) => {
  try {
    const {
      uid,
      displayName,
      email,
      emailVerified = false,
      photoURL,
      password,
      phoneNumber,
      role = USER_ROLES.DEFAULT,
      isAdminAccess = false,
    }: IUser = data;

    await User.updateOne(
      { uid },
      {
        email,
        emailVerified,
        phoneNumber,
        photoURL,
        uid,
        displayName,
        role,
        isAdminAccess,
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    logging.error("Register", "unable to register", error);
    return false;
  }
};

export const revokeToken = (uid: string) => {
  getAuth(adminApp)
    .revokeRefreshTokens(uid)
    .then(() => {
      return getAuth().getUser(uid);
    })
    .then((userRecord: any) => {
      return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
    })
    .then((timestamp) => {
      console.log(`Tokens revoked at: ${timestamp}`);
    });
};
