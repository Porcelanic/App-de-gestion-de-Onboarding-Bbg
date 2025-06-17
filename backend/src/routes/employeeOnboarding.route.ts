import { Router } from "express";
import { employeeOnboardingController } from "../modules/employeeOnboarding/controllers/employeeOnboarding.controller.index";
import { authMiddleware } from "../config/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

// Assign an employee to an onboarding process
router.post(
  "/",
  (req, res) => employeeOnboardingController.assignEmployee(req, res)
);

// Update the status of an employee's onboarding assignment
// Uses composite key in the path: onboardingId and employeeEmail
router.patch(
  "/:onboardingId/employees/:employeeEmail",
  (req, res) => employeeOnboardingController.updateAssignmentStatus(req, res)
);

// Get a specific employee's onboarding assignment
router.get(
  "/:onboardingId/employees/:employeeEmail",
  (req, res) => employeeOnboardingController.getAssignment(req, res)
);

// Get all assignments for a specific employee
router.get(
  "/employee/:employeeEmail",
  (req, res) => employeeOnboardingController.getAssignmentsForEmployee(req, res)
);

// Get all employees assigned to a specific onboarding process
router.get(
  "/onboarding/:onboardingId",
  (req, res) => employeeOnboardingController.getAssignmentsForOnboarding(req, res)
);

// Unassign an employee from an onboarding process
router.delete(
  "/:onboardingId/employees/:employeeEmail",
  (req, res) => employeeOnboardingController.unassignEmployee(req, res)
);

export default router;