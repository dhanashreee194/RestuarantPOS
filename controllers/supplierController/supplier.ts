import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { ISupplier } from "../../interfaces/ISupplier";
import Supplier from "../../models/Supplier";

export const addSupplier = async (req: Request, res: Response) => {
  try {
    const {
      name = "",
      contactNumber = "",
      email = "",
      companyName = "",
      address = "",
    }: ISupplier = req.body;

    if (
      name == "" ||
      email == "" ||
      companyName == "" ||
      contactNumber == "" ||
      address == ""
    ) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide valid object  ",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const newSupplier: ISupplier = new Supplier({
      name,
      companyName,
      contactNumber,
      email,
      address,
    });
    await newSupplier.save();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully added new Supplier",
      error: null,
      resObj: res,
      data: newSupplier,
    });
  } catch (error: any) {
    logging.error("Add Supplier", "unable to add Supplier", error);

    if (error?.message) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: error.message.includes("E11000 duplicate key")
          ? "duplicate Supplier"
          : error.message,
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

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { _id = "" } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Supplier ID",
        error: null,
        resObj: res,
        data: null,
      });

    await Supplier.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Supplier",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Supplier", "unaable to update Supplier", error);
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

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const Suppliers = await Supplier.find();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Suppliers",
      error: null,
      resObj: res,
      data: Suppliers,
    });
  } catch (error) {
    logging.error("Get Suppliers", "unaable to get Suppliers", error);
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

export const getSupplier = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Supplier ID",
        error: null,
        resObj: res,
        data: null,
      });
    const supplier = await Supplier.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Supplier",
      error: null,
      resObj: res,
      data: supplier,
    });
  } catch (error) {
    logging.error("Get Supplier", "unable to get Supplier", error);
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

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Supplier ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Supplier.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Supplier is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Delete Supplier", "unable to delete Supplier", error);
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
