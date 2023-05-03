import dotenv from "dotenv";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import "./db";
import router from "./routes/v1";
import  "./firebase";

import http from 'http';
import { Server, Socket } from "socket.io"
import logging from "./config/logging";
import { startListening } from "./socket_init";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { createSuperAdmin } from "./scripts/createSuperAdmin";
import { csvParser } from "./helper/utils";


dotenv.config();

globalThis.__dirname = __dirname;
const app: Express = express();
const port = 4000;
app.use(cors());
app.use(express.json({limit:"100mb"}))
app.use(express.urlencoded({extended:true}))

//socket io configuration
const server = http.createServer(app);
const io = new Server(server);

declare global {
  var socketObj:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>|null;
}

// global.socketObj:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>|null = null;
//socket io connection test
io.on("connection", (socket) => {
  logging.info("SOCKET", "connection established");
  global.socketObj=socket
  socket.on("disconnect", () => {
    logging.error("SOCKET", "user disconnected");
  });
  startListening(socket)
});
// socket io configuration end

app.use("/api/v1",router)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});


export default io;


// import csv from 'csvtojson'

// const dataRead=async()=>{
//   const data =   await csvParser("./test.csv");
//   // console.log("datya",data)
//   const jsonArray=await csv().fromFile("./test.csv");
//   console.log("__",jsonArray)
// }
// dataRead()