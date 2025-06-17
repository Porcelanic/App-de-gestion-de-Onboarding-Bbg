import { Router } from "express";
import { onboardingTypeController } from "../modules/onboarding/onboardingType/controllers/onboardingtype.controller.index";
import { authMiddleware } from "../config/middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.post("/", (req, res) =>
  onboardingTypeController.createOnboardingType(req, res)
);

router.get("/", (req, res) =>
  onboardingTypeController.getAllOnboardingTypes(req, res)
);

router.get("/:typeId", (req, res) =>
  onboardingTypeController.getOnboardingTypeById(req, res)
);

router.put("/:typeId", (req, res) =>
  onboardingTypeController.updateOnboardingType(req, res)
);

router.delete("/:typeId", (req, res) =>
  onboardingTypeController.deleteOnboardingType(req, res)
);

export default router;
