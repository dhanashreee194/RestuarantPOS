import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IKitchan } from "../../interfaces/IKitchan";
import Kitchan from "../../models/Kitchan";
import { v4 as uuidv4 } from 'uuid';
import { EMOPLOYEE_ROLES } from "../../config/enums";
import Employee from "../../models/Employee";
import { IEmployee } from "../../interfaces/IEmployee";

export const addKitichan = async (req: Request, res: Response) => {
  try {
    const { kName = "",resturantName="" }: IKitchan = req.body;

    if (kName == ""||resturantName=="") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid kitichan name and associated Resturant Name",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const isKitchanExist =await Kitchan.findOne({$and:[{kName},{resturantName}]})
    if(isKitchanExist) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "duplicate kitichen name and associated Resturant Name",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const isNewKitchanAdd = await addNewKitchan(resturantName,kName);

    if (isNewKitchanAdd)
      return responseObj({
        statusCode: HTTP_RESPONSE.SUCCESS,
        type: "success",
        msg: "hey, you are successfully added new kitchan",
        error: null,
        resObj: res,
        data: isNewKitchanAdd,
      });

    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: "unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("KITCHAN", "unable to add kitchan", error);
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

export const addEmployeeToKitchan = async (req: Request, res: Response) => {
  try {
    const { kid = "", employeeId = "" } = req.body;
    if (kid == "" || employeeId == "") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid kitichan id and employee id",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const employee = await Employee.findOne({_id: employeeId});
    if(!employee) 
    return responseObj({
      statusCode: HTTP_RESPONSE.BED_REQUEST,
      type: "error",
      msg: "please provide a valid employee id",
      error: null,
      resObj: res,
      data: null,
    });

   

    const kitchan = await Kitchan.findOne({ kid });
    if (!kitchan) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "kitchan not availble or invalid kitchan id",
        error: null,
        resObj: res,
        data: null,
      });
    }

    if (employee.role == EMOPLOYEE_ROLES.CAFE) {
      const isCafeAlreadyAdded = kitchan.cafes.filter(
        (cafe) => cafe.id === employeeId
      );
      if (isCafeAlreadyAdded.length > 0) {
        return responseObj({
          statusCode: HTTP_RESPONSE.SUCCESS,
          type: "success",
          msg: "hey, you are successfully employee to the kitchan",
          error: null,
          resObj: res,
          data: null,
        });
      }
      kitchan.cafes.push({
        id: employeeId,
        skill: employee.skill,
        assignedOrders: [],
      });
      await kitchan.save();
    }
    else if (employee.role == EMOPLOYEE_ROLES.WAITER) {
      const isWaiterAlreadyAdded = kitchan.waiters.filter(
        (waiter) => waiter.id === employeeId
      );
      if (isWaiterAlreadyAdded.length > 0) {
        return responseObj({
          statusCode: HTTP_RESPONSE.SUCCESS,
          type: "success",
          msg: "hey, you are successfully employee to the kitchan",
          error: null,
          resObj: res,
          data: null,
        });
      }
      kitchan.waiters.push({
        id: employeeId,
        assignedOrders: [],
      });

      await kitchan.save();
    }
    else{
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "Employee role should be cafe or waiter",
        error: null,
        resObj: res,
        data: null,
      });
    }

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully add employee to the kitchan",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (err) {
    logging.error("KITCHAN", "unable to add cafe to kitchan", err);
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


export const getKitchans = async (req: Request, res: Response) => {
  try {
    const kitchans = await Kitchan.find();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Kitchans",
      error: null,
      resObj: res,
      data: kitchans,
    });
  } catch (error) {
    logging.error("Get Kitchans", "unaable to get Kitchans", error);
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

export const getKitchan = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Kitchan ID",
        error: null,
        resObj: res,
        data: null,
      });
    const kitchan = await Kitchan.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Kitchan",
      error: null,
      resObj: res,
      data: kitchan,
    });
  } catch (error) {
    logging.error("Get Kitchan", "unable to get Kitchan", error);
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

export const addNewKitchan = async (resturantName:string,kitchanName: string) => {
  try {
    const kid = kitchanName + uuidv4();
    const newKitchan = new Kitchan({
      kid,
      kName: kitchanName,
      resturantName,
    });
    await newKitchan.save();
    logging.info("KITCHAN", "new kitchan added successfully");
    return newKitchan;
  } catch (err) {
    logging.error("KITCHAN", "unable to add kitchan", err);
    return null;
  }
};

//impotant
export const assignedOrderToCafe = async (kid: string, oid: string) => {
  try {
    const cafeHasLeastOfOrders = await Kitchan.aggregate([
      {
        $match: {
          kid,
        },
      },
      {
        $unwind: "$cafes",
      },
      {
        $addFields: {
          cafes_size: {
            $size: "$cafes.assignedOrders",
          },
        },
      },
      {
        $sort: {
          cafes_size: 1,
        },
      },
      {
        $limit: 1,
      },
    ]);
    let availableCafeId;
    if (cafeHasLeastOfOrders && cafeHasLeastOfOrders.length > 0) {
      availableCafeId = cafeHasLeastOfOrders[0].cafes.id;
    }

    await Kitchan.updateOne(
      {
        kid,
        "cafes.id": availableCafeId,
      },
      {
        $push: { "cafes.$.assignedOrders": oid },
      }
    );
    return availableCafeId
  } catch (err) {
    return null;
  }
};

//after assigning need to update cafe or waiter


export const addKitchanCafe = async (kid: string, employeeId: string) => {
  try {
    const kitchan = await Kitchan.findOne({ kid });
    if (!kitchan) {
      return -1;
    }

    const isCafeAlreadyAdded = kitchan.cafes.filter(
      (cafe) => cafe.id === employeeId
    );
    if (isCafeAlreadyAdded.length > 0) {
      return 1;
    }
    kitchan.cafes.push({
      id: employeeId,
      assignedOrders: [],
    });

    await kitchan.save();
    return 1;
  } catch (err) {
    logging.error("KITCHAN", "unable to add cafe to kitchan", err);
    return 0;
  }
};

export const addKitchanWaiter = async (kid: string, employeeId: string) => {
  try {
    const kitchan = await Kitchan.findOne({ kid });
    if (!kitchan) {
      return -1;
    }

    const isWaiterAlreadyAdded = kitchan.waiters.filter(
      (waiter) => waiter.id === employeeId
    );
    if (isWaiterAlreadyAdded.length > 0) {
      return 1;
    }
    kitchan.waiters.push({
      id: employeeId,
      assignedOrders: [],
    });

    await kitchan.save();
    return 1;
  } catch (err) {
    logging.error("KITCHAN", "unable to add waiter to kitchan", err);
    return 0;
  }
};

