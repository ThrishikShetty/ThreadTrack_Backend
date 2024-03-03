import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
// import {
//   deleteUser,
//   getAllUsers,
//   getUser,
//   newUser,
// } from "../controllers/user.js";
// import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// route - /api/v1/user/new
app.post("/new", newUser);


// to show all the user in the admin page

// route - /api/v1/user/all
app.get("/all",adminOnly,getAllUsers)

// route - /api/v1/user/dynamic_id
// app.get("/:id", getUser)

// app.delete("/:id", deleteUser)
app.route("/:id").get(getUser).delete(adminOnly,  deleteUser)


export default app;
