import express from "express";
import {
  addUser,
  getUser,
  getUsers,
} from "../../controllers/authController/auth";
import { auth } from "../../middelware/firebaseAuth";
import {
  addFoodProduct,
  deleteFoodProduct,
  getFoodProduct,
  getFoodProducts,
  updateFoodProduct,
} from "../../controllers/foodProductController/foodProduct";
import {
  addTable,
  deleteTable,
  getTable,
  getTables,
  updateTable,
} from "../../controllers/tableController/table";
import {
  addEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../../controllers/employeeController/employee";
import {
  addCustomer,
  getCustomer,
  getCustomers,
} from "../../controllers/customerController/customer";
import {
  addOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "../../controllers/orderController/order";
import {
  addEmployeeToKitchan,
  addKitichan,
  getKitchan,
  getKitchans,
} from "../../controllers/kitchanController/kitchan";
import {
  addBulkInventory,
  addInventory,
  getInventory,
  getInventorys,
  updateInventory,
} from "../../controllers/inventoryController/inventory";
import { upload } from "../../middelware/uploder";
const router = express.Router();

//user
router.post("/user", auth, addUser);
router.get("/user", auth, getUsers);
router.get("/user/current", auth, getUser);

//food product
router.post("/product", auth, addFoodProduct);
router.put("/product", auth, updateFoodProduct);
router.get("/product", getFoodProducts);
router.get("/product/:id", getFoodProduct);
router.delete("/product/:id", auth, deleteFoodProduct);

//table
router.post("/table", auth, addTable);
router.put("/table", auth, updateTable);
router.get("/table", getTables);
router.get("/table/:id", getTable);
router.delete("/table/:id", auth, deleteTable);

//employees
router.post("/employee", auth, addEmployee);
router.put("/employee", auth, updateEmployee);
router.get("/employee", auth, getEmployees);
router.get("/employee/:id", auth, getEmployee);
router.delete("/employee/:id", auth, deleteEmployee);

//employees
router.post("/customer", addCustomer);
router.get("/customer", auth, getCustomers);
router.get("/customer/:id", auth, getCustomer);

//order
router.post("/order", addOrder);
router.put("/order", auth, updateOrder);
router.get("/order", auth, getOrders);
router.get("/order/:id", auth, getOrder);

//kitchen
router.post("/kitchen", auth, addKitichan);
router.get("/kitchen", auth, getKitchans);
router.get("/kitchen/:id", auth, getKitchan);

//kitichen
router.post("/kitchen/employee", auth, addEmployeeToKitchan);

//inventory
router.post("/inventory",auth, addInventory);
router.put("/inventory", auth, updateInventory);
router.get("/inventory", auth, getInventorys);
router.get("/inventory/:id", auth, getInventory);

router.post("/inventory/csv",auth,upload.single("inventories"), addBulkInventory);

export default router;
