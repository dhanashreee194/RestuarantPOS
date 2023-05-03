import { Request, Response } from "express";
import logging from "../../config/logging";
import { HTTP_RESPONSE } from "../../helper/constants";
import { responseObj } from "../../helper/response";
import { IOrder } from "../../interfaces/IOrder";
import Order from "../../models/Order";
import { ORDER_STATUS } from "../../config/enums";
import { assignedOrderToCafe } from "../kitchanController/kitchan";
import Table from "../../models/Table";

export const addOrder = async (req: Request, res: Response) => {
  try {
    const {
      kid="",
      pids = [],
      tableId = "",
      customerId = "",
      status = ORDER_STATUS.PLACED,
      // cafeId = "",
      // waiterId = "",
      waitingTime = "",
    }: IOrder = req.body;

    if (
      pids.length < 1 ||
      tableId == "" ||
      customerId == ""
      // cafeId == ""
    ) {
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order object",
        error: null,
        resObj: res,
        data: null,
      });
    }

    const table =await Table.findOne({_id:tableId})
    if(!table)
    return responseObj({
      statusCode: HTTP_RESPONSE.BED_REQUEST,
      type: "error",
      msg: "Table not found",
      error: null,
      resObj: res,
      data: null,
    });

    const newOrder: IOrder = new Order({
      pids,
      tableNumber:table.tableNumber,
      tableId,
      customerId,
      status,
      kid,
      waitingTime,
    });
    await newOrder.save();
    global.socketObj?.emit("order_created", newOrder);
    
    const doc= newOrder.toJSON()

    let cafeId = await assignedOrderToCafe(kid,newOrder._id)
    if(!cafeId){
       cafeId = await assignedOrderToCafe(kid,newOrder._id)
    }
    await Order.updateOne({_id:newOrder._id},{
      $set:{
        cafeId
      }
    })

    global.socketObj?.emit("order_assinged", {...doc,cafeId});
    global.socketObj?.to(cafeId).emit("order_assinged", {...doc,cafeId});

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully posted new Order",
      error: null,
      resObj: res,
      data: newOrder,
    });
  } catch (error) {
    logging.error("Add Order", "unable to add Order", error);
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

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { _id = "" } = req.body;
    if (_id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID",
        error: null,
        resObj: res,
        data: null,
      });

    await Order.updateOne(
      { _id },
      {
        ...req.body,
      }
    );

    delete req.body.user

    global.socketObj?.emit("order_updated", req.body);
    global.socketObj?.to(req.body?.cafeId).emit("order_assinged", req.body);

    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "hey, you are successfully updated Order",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Update Order", "unaable to update Order", error);
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

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Orders",
      error: null,
      resObj: res,
      data: orders,
    });
  } catch (error) {
    logging.error("Get Orders", "unaable to get Orders", error);
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

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID",
        error: null,
        resObj: res,
        data: null,
      });
    const order = await Order.findOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Order",
      error: null,
      resObj: res,
      data: order,
    });
  } catch (error) {
    logging.error("Get Order", "unable to get Order", error);
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

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id = "" } = req.params;
    if (id == "")
      return responseObj({
        statusCode: HTTP_RESPONSE.BED_REQUEST,
        type: "error",
        msg: "please provide a valid Order ID",
        error: null,
        resObj: res,
        data: null,
      });
    await Order.deleteOne({ _id: id });
    return responseObj({
      statusCode: HTTP_RESPONSE.SUCCESS,
      type: "success",
      msg: "your Order is successfully deleted",
      error: null,
      resObj: res,
      data: null,
    });
  } catch (error) {
    logging.error("Delete Order", "unable to delete Order", error);
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
