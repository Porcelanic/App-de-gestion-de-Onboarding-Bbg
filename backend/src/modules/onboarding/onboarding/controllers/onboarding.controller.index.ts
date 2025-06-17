import { OnboardingController } from "./onboarding.controller";
import { OnboardingService } from "../services/onboarding.service";
import { OnboardingRepository } from "../repositories/onboarding.repository";
import { OnboardingTypeRepository } from "../../onboardingType/repositories/onboardingtype.repository";

const onboardingRepository = new OnboardingRepository();
const onboardingTypeRepository = new OnboardingTypeRepository();
const onboardingService = new OnboardingService(onboardingRepository, onboardingTypeRepository);
const onboardingController = new OnboardingController(onboardingService);

export { onboardingController };
