import express from "express";
import { authMiddleware } from "../config/middleware/authMiddleware";
import { roleController } from "../modules/employee/role/controllers/role.controller.index";

const router = express.Router();

router.get("/", authMiddleware, roleController.getRoles.bind(roleController));

router.post(
    "/",
    authMiddleware,
    roleController.createRole.bind(roleController)
);

router.put(
    "/:roleId",
    authMiddleware,
    roleController.updateRole.bind(roleController)
);

router.delete(
    "/:roleId",
    authMiddleware,
    roleController.deleteRole.bind(roleController)
);

export default router;
