import { EMOPLOYEE_ROLES, USER_ROLES } from "../config/enums";

type IsAuthorizedProps = {
  uri_path: string;
  role: number;
  employeeRole: number;
  isAdminAccess: boolean;
  request_method: string;
};

export const isAuthorized = ({
  uri_path,
  role = USER_ROLES.DEFAULT,
  employeeRole = EMOPLOYEE_ROLES.DEFAULT,
  isAdminAccess,
  request_method,
}: IsAuthorizedProps) => {
  if (uri_path.includes("/user")) {
    if (role == USER_ROLES.SUPER_ADMIN) return true;
    return false;
  }

  if (uri_path.includes("/product")) {
    if (
      isAdminAccess ||
      role == USER_ROLES.SUPER_ADMIN ||
      role == USER_ROLES.ADMIN
    )
      return true;
    return false;
  }

  if (uri_path.includes("/table")) {
    if (
      isAdminAccess ||
      role == USER_ROLES.SUPER_ADMIN ||
      role == USER_ROLES.ADMIN
    )
      return true;
    return false;
  }
  if (uri_path.includes("/employee")) {
    if (
      isAdminAccess ||
      role == USER_ROLES.SUPER_ADMIN ||
      role == USER_ROLES.ADMIN
    )
      return true;
    return false;
  }

  if (uri_path.includes("/customer")) {
    if (
      isAdminAccess ||
      role == USER_ROLES.SUPER_ADMIN ||
      role == USER_ROLES.ADMIN
    )
      return true;
    return false;
  }

  if (uri_path.includes("/kitchen")) {
    if (
      isAdminAccess ||
      role == USER_ROLES.SUPER_ADMIN ||
      role == USER_ROLES.ADMIN
    )
      return true;
    return false;
  }

  console.log("employ", employeeRole, EMOPLOYEE_ROLES.CAFE);
  if (uri_path.includes("/order")) {
    if (request_method == "PUT") {
      if (
        isAdminAccess ||
        role == USER_ROLES.SUPER_ADMIN ||
        role == USER_ROLES.ADMIN ||
        employeeRole == EMOPLOYEE_ROLES.CAFE
      )
        return true;
      return false;
    }
    return true;
  }
  
  if (uri_path.includes("/inventory")) {
    if (
      isAdminAccess ||
      role == USER_ROLES.SUPER_ADMIN ||
      role == USER_ROLES.ADMIN
    )
      return true;
    return false;
  }

  return false;

  //   switch (uri_path) {
  //     case "/user":
  //       if (role == USER_ROLES.SUPER_ADMIN) return true;
  //       return false;
  //     case "/product":
  //       console.log("--", role, role == USER_ROLES.ADMIN, uri_path,request_method);
  //       if (
  //         isAdminAccess ||
  //         role == USER_ROLES.SUPER_ADMIN ||
  //         role == USER_ROLES.ADMIN
  //       )
  //         return true;
  //       return false;
  //   }
};
