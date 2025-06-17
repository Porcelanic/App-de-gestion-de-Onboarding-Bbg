import { Router } from "express";
import { onboardingController } from "../modules/onboarding/onboarding/controllers/onboarding.controller.index";
import { authMiddleware } from "../config/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  (req, res) => onboardingController.createOnboarding(req, res)
);

router.get(
  "/",
  (req, res) => onboardingController.getAllOnboardings(req, res)
);

router.get(
  "/:onboardingId",
  (req, res) => onboardingController.getOnboardingById(req, res)
);

router.put(
  "/:onboardingId",
  (req, res) => onboardingController.updateOnboarding(req, res)
);

router.delete(
  "/:onboardingId",
  (req, res) => onboardingController.deleteOnboarding(req, res)
);

export default router;
