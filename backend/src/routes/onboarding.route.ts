import { Router } from "express";
import { onboardingController } from "../modules/employeeOnboarding/onboarding/onboarding/controllers/onboarding.controller.index";
import { authMiddleware } from "../config/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

// Create a new Onboarding process
router.post(
  "/",
  (req, res) => onboardingController.createOnboarding(req, res)
);

// Get all Onboarding processes
router.get(
  "/",
  (req, res) => onboardingController.getAllOnboardings(req, res)
);

// Get a single Onboarding process by ID
router.get(
  "/:onboardingId",
  (req, res) => onboardingController.getOnboardingById(req, res)
);

// Update an Onboarding process by ID
router.put(
  "/:onboardingId",
  (req, res) => onboardingController.updateOnboarding(req, res)
);

// Delete an Onboarding process by ID
router.delete(
  "/:onboardingId",
  (req, res) => onboardingController.deleteOnboarding(req, res)
);

export default router;
