import { USER_ROLES } from "../config/enums";
import logging from "../config/logging";
import {
  addUserToFirebase,
  addUserToMongoDB,
  deleteUserFromFirebase,
} from "../controllers/authController/auth";
import { IUser } from "../interfaces/IUser";

export const createSuperAdmin = async () => {
  try {
    const userObj: any = {
      displayName: "sanjiv",
      email: "mr.sanjiv05@gmail.com",
      phoneNumber: "+916205796058",
      role: USER_ROLES.SUPER_ADMIN,
      isAdminAccess: true,
      password: "$@tiy@0005",
    };
    const newUserRecord = await addUserToFirebase(userObj);
    const isAdded = await addUserToMongoDB({
      ...userObj,
      uid: newUserRecord.uid,
    });

    if (!isAdded) {
      await deleteUserFromFirebase(newUserRecord.uid);

      logging.error("USER","Unable to create super admin");
      return
    }
    logging.info("USER","Super Admin Created");
  } catch (err) {
    logging.error("USER","Unable to create super admin",err);
  }
};
