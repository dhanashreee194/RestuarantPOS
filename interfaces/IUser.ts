import { Document } from "mongoose"
import { EMOPLOYEE_ROLES, USER_ROLES } from "../config/enums"

interface IUser extends Document{
    displayName:string,
    email:string,
    uid?:string,
    fcmToken?: string,
    emailVerified?:boolean,
    photoURL?:string,
    phoneNumber?:string
    createdAt?:string,
    password:string,
    role?:USER_ROLES,
    isAdminAccess?:boolean,
    employeeRole?:EMOPLOYEE_ROLES
}

export {IUser}
