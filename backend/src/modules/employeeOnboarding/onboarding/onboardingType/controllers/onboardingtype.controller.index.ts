import { OnboardingTypeController } from "./onboardingtype.controller";
import { OnboardingTypeService } from "../services/onboardingtype.service";
import { OnboardingTypeRepository } from "../repositories/onboardingtype.repository";

const onboardingTypeRepository = new OnboardingTypeRepository();
const onboardingTypeService = new OnboardingTypeService(onboardingTypeRepository);
const onboardingTypeController = new OnboardingTypeController(onboardingTypeService);

export { onboardingTypeController };
