import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { ITable } from "../../interfaces/ITable";
import Table from "../../models/Table";

export const addTable = async (req: Request, res: Response) => {
  try {
    const { totalSeats = 0, tableNumber = -1, about = "",kid="" }: ITable = req.body;

    if (kid=="") {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide kitchen id ",
        error: null,
        resObj: res,
        data: null,
      });
    }
    if (tableNumber <= -1 || totalSeats <= 0) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid table no. and  total seats",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const newTable: ITable = new Table({
      tableNumber,
      totalSeats,
      availableSeats: totalSeats,
      about,
      kid
    });
    await newTable.save();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully posted new Table",
      error: null,
      resObj: res,
      data: newTable,
    });
  } catch (error:any) {
    logging.error("Add Table", "unable to add Table", error);

    if(error?.message){
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("E11000 duplicate key")?"duplicate table":error.message,
        error: null,
        resObj: res,
        data: null,
      });
    }

    return responseObj({
      statusCode: HTTP_RESPONSE.INTERNAL_SERVER_ERROR,
      type: "error",
      msg: error?.message||"unable to process your request",
      error: null,
      resObj: res,
      data: null,
    });
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const { _id = "" } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Table ID",
        error: null,
        resObj: res,
        data: null,
      });

    await Table.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Table",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Table", "unaable to update Table", error);
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

export const getTables = async (req: Request, res: Response) => {
  try {
    const Tables = await Table.find();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Tables",
      error: null,
      resObj: res,
      data: Tables,
    });
  } catch (error) {
    logging.error("Get Tables", "unaable to get Tables", error);
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

export const getTable = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Table ID",
        error: null,
        resObj: res,
        data: null,
      });
    const table = await Table.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Table",
      error: null,
      resObj: res,
      data: table,
    });
  } catch (error) {
    logging.error("Get Table", "unable to get Table", error);
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

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Table ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Table.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Table is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Delete Table", "unable to delete Table", error);
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
