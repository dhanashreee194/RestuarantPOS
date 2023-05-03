import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IEmployee } from "../../interfaces/IEmployee";
import Employee from "../../models/Employee";
import { CAFE_SKILL, EMOPLOYEE_ROLES, USER_ROLES } from "../../config/enums";
import {
  addUserToFirebase,
  deleteUserFromFirebase,
} from "../authController/auth";
import { addKitchanCafe } from "../kitchanController/kitchan";

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const {
      name = "",
      phoneNumber = "",
      email = "",
      address = "",
      jobTitle = "",
      // isCafe = false,
      skill = CAFE_SKILL.UNKNOWN,
      payScale = 0, //optional
      workingHours = 0, //optional
      role = EMOPLOYEE_ROLES.DEFAULT,
      joiningDate = "",
      inLeave = false,
      password = "",
    }: IEmployee = req.body;

    if (role==EMOPLOYEE_ROLES.CAFE && skill == CAFE_SKILL.UNKNOWN) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a cafe skill",
        error: null,
        resObj: res,
        data: null,
      });
    }
    if (
      name == "" ||
      phoneNumber == "" ||
      email == "" ||
      address == "" ||
      jobTitle == "" ||
      password == ""
    ) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Employee object",
        error: null,
        resObj: res,
        data: null,
      });
    }

    if (joiningDate == "") req.body.joiningDate = new Date().toISOString();

    const userObj: any = {
      displayName: name,
      email,
      password,
      phoneNumber,
      role: USER_ROLES.EMOPLOYEE,
      employeeRole: role,
    };

    const user = await addUserToFirebase(userObj);
    if (!user) {
      return responseObj({
        statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
        type: "error",
        msg: "unable to process your request",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const newEmployee = await addEmployeeToMongo(req.body);
    if (!newEmployee) {
      await deleteUserFromFirebase(user.uid);
      return responseObj({
        statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
        type: "error",
        msg: "unable to process your request",
        error: null,
        resObj: res,
        data: null,
      });
    }

    //assign the new employee to kitchan if employee role is cafe or waiter

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully posted new Employee",
      error: null,
      resObj: res,
      data: newEmployee,
    });
  } catch (error: any) {
    logging.error("Add Employee", "unable to add Employee", error);
    logging.error(
      "Add Employee",
      "unable to add Employee message",
      error?.message
    );

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

const addEmployeeToMongo = async (data: IEmployee) => {
  try {
    const newEmployee: IEmployee = new Employee(data);
    await newEmployee.save();
    return newEmployee;
  } catch (err) {
    return null;
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { _id = "" } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Employee ID",
        error: null,
        resObj: res,
        data: null,
      });

    await Employee.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Employee",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error("Update Employee", "unaable to update Employee", error);
    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("Cast to ObjectId failed")
          ? "Please provide valid product id"
          : error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    }
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

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your employees",
      error: null,
      resObj: res,
      data: employees,
    });
  } catch (error) {
    logging.error("Get Employees", "unaable to get Employees", error);
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

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Employee ID",
        error: null,
        resObj: res,
        data: null,
      });
    const employee = await Employee.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your employee",
      error: null,
      resObj: res,
      data: employee,
    });
  } catch (error: any) {
    logging.error("Get Employee", "unable to get Employee", error);
    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("Cast to ObjectId failed")
          ? "Please provide valid product id"
          : error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    }
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

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Employee ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Employee.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Employee is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error("Delete Employee", "unable to delete Employee", error);
    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("Cast to ObjectId failed")
          ? "Please provide valid product id"
          : error?.message,
        error: null,
        resObj: res,
        data: null,
      });
    }
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
