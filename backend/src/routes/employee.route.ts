import express from "express";
import { authMiddleware } from "../config/middleware/authMiddleware";
import { employeeController } from "../modules/employeeOnboarding/employee/employee/controllers/employee.controller.index";

const router = express.Router();

router.post("/register", (req, res) =>
  employeeController.registerEmployee(req, res)
);
router.post("/login", (req, res) => employeeController.loginEmployee(req, res));
router.post("/refresh-token", (req, res) =>
  employeeController.refreshToken(req, res)
);

router.use(authMiddleware);

router.get("/", (req, res) => employeeController.getAllEmployees(req, res));
router.get("/:email", (req, res) =>
  employeeController.getEmployeeByEmail(req, res)
);
router.put("/:email", (req, res) =>
  employeeController.updateEmployee(req, res)
);
router.delete("/:email", (req, res) =>
  employeeController.deleteEmployee(req, res)
);

export default router;
