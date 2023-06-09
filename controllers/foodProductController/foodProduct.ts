import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IFoodProduct } from "../../interfaces/IFoodProduct";
import FoodProduct from "../../models/FoodProduct";

export const addFoodProduct = async (req: Request, res: Response) => {
  try {
    const {
      name = "",
      image = "",
      description = "",
      price = 0,
      expiryDate = "",
      isReadyToServe = false,
    }: IFoodProduct = req.body;

    console.log(name, image, description, price);

    if (name == "" || image == "" || description == "" || price == 0) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid data object",
        error: null,
        resObj: res,
        data: null,
      });
    }
    const date = new Date(expiryDate);

    if (
      isReadyToServe &&
      (expiryDate == undefined ||
        expiryDate == "" ||
        date.getTime() <= new Date().getTime())
    ) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please add valid expiry date to beacuse this is ready to serve food product",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const newFoodProduct: IFoodProduct = new FoodProduct(req.body);
    await newFoodProduct.save();

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully posted new Food Product",
      error: null,
      resObj: res,
      data: newFoodProduct,
    });
  } catch (error) {
    logging.error("Add Food Product", "unable to add Food Product", error);
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

export const updateFoodProduct = async (req: Request, res: Response) => {
  try {
    const { _id = "" } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid FoodProduct ID",
        error: null,
        resObj: res,
        data: null,
      });

    await FoodProduct.updateOne(
      { _id },
      {
        ...req.body,
      }
    );
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Food Product",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error(
      "Update FoodProduct",
      "unaable to update Food Product",
      error
    );

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

export const getFoodProducts = async (req: Request, res: Response) => {
  try {
    const FoodProducts = await FoodProduct.find();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Food Products",
      error: null,
      resObj: res,
      data: FoodProducts,
    });
  } catch (error) {
    logging.error("Get Food Products", "unaable to get Food Products", error);
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

export const getFoodProduct = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid FoodProduct ID",
        error: null,
        resObj: res,
        data: null,
      });
    const foodProduct = await FoodProduct.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Food Product",
      error: null,
      resObj: res,
      data: foodProduct,
    });
  } catch (error: any) {
    logging.error("Get Food Product", "unable to get FoodProduct", error);
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

export const deleteFoodProduct = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid FoodProduct ID",
        error: null,
        resObj: res,
        data: null,
      });
    await FoodProduct.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Food Product is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error: any) {
    logging.error("Delete Food Product", "unable to delete FoodProduct", error);
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
