import mongoose, { Schema } from "mongoose";

import logging from "../config/logging";
import { IUser } from "../interfaces/IUser";

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  fcmToken: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  role: {
    type: Number,
  },
  isAdminAccess:{
    type: Boolean,
  },
  employeeRole:{
    type: Number,
    default: -1
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const salt = 10;

UserSchema.pre<IUser>("save", async function (next) {
  // const user = this;
  // if (user.isModified("password")) {
  //   user.password = await bcryptjs.hash(user.password, salt);
  // }
  next();
});

UserSchema.post<IUser>("save", function () {
  logging.info("Mongo", "New user just saved: ");
});

export default mongoose.model<IUser>("User", UserSchema);
