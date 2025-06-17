import { EmployeeOnboarding } from "../../../entities/employeeOnboarding/EmployeeOnboarding";
import { EmployeeOnboardingRepository } from "../repositories/employeeOnboarding.repository";
import { OnboardingRepository } from "../../onboarding/onboarding/repositories/onboarding.repository";
import { EmployeeRepository } from "../../employee/employee/repositories/employee.repository";
import {
  validateAssignEmployeeToOnboarding,
  validateUpdateStatus,
} from "../utils/employeeOnboarding.validations";
import {
  AssignEmployeeToOnboardingDto,
  UpdateEmployeeOnboardingStatusDto,
  EmployeeOnboardingDto,
  AssignEmployeeResult,
  UpdateAssignmentStatusResult,
  GetAssignmentResult,
  GetAssignmentsListResult,
  UnassignEmployeeResult,
} from "../dtos/employeeOnboarding.dtos";
import { EmployeeDto } from "../../employee/employee/dtos/employee.dtos";
import { OnboardingDto } from "../../onboarding/onboarding/dtos/onboarding.dtos";
import { OnboardingTypeDto } from "../../onboarding/onboardingType/dtos/onboardingtype.dtos";

export class EmployeeOnboardingService {
  constructor(
    private employeeOnboardingRepository: EmployeeOnboardingRepository,
    private onboardingRepository: OnboardingRepository,
    private employeeRepository: EmployeeRepository
  ) {}

  private mapToEmployeeDto(employee: any): EmployeeDto {
    return {
      employeeEmail: employee.employeeEmail,
      name: employee.name,
      hireDate: employee.hireDate,
      terminationDate: employee.terminationDate,
      roleId: employee.roleId,
    };
  }

  private mapToOnboardingTypeDto(onboardingType: any): OnboardingTypeDto {
    return {
      typeId: onboardingType.typeId,
      name: onboardingType.name,
      description: onboardingType.description,
    };
  }

  private mapToOnboardingDto(onboarding: any): OnboardingDto {
    return {
      onboardingId: onboarding.onboardingId,
      name: onboarding.name,
      startDate: onboarding.startDate,
      endDate: onboarding.endDate,
      typeId: onboarding.typeId,
      onboardingType: onboarding.onboardingType
        ? this.mapToOnboardingTypeDto(onboarding.onboardingType)
        : undefined,
    };
  }

  private mapToEmployeeOnboardingDto(
    eo: EmployeeOnboarding
  ): EmployeeOnboardingDto {
    return {
      onboardingId: eo.onboardingId,
      employeeEmail: eo.employeeEmail,
      done: eo.done,
      onboarding: eo.onboarding
        ? this.mapToOnboardingDto(eo.onboarding)
        : undefined,
      employee: eo.employee ? this.mapToEmployeeDto(eo.employee) : undefined,
    };
  }

  async assignEmployeeToOnboarding(
    dto: AssignEmployeeToOnboardingDto
  ): Promise<AssignEmployeeResult> {
    const validationErrors = await validateAssignEmployeeToOnboarding(
      dto,
      this.employeeOnboardingRepository,
      this.onboardingRepository,
      this.employeeRepository
    );

    if (validationErrors.length > 0) {
      const employeeNotFound = validationErrors.some(
        (e) => e.includes("Employee with email") && e.includes("not found")
      );
      const onboardingNotFound = validationErrors.some(
        (e) =>
          e.includes("Onboarding process with ID") && e.includes("not found")
      );
      const alreadyAssigned = validationErrors.some((e) =>
        e.includes("already assigned")
      );

      return {
        errors: validationErrors,
        employeeNotFound,
        onboardingNotFound,
        alreadyAssigned,
      };
    }

    const employeeOnboarding = new EmployeeOnboarding();
    employeeOnboarding.onboardingId = dto.onboardingId;
    employeeOnboarding.employeeEmail = dto.employeeEmail;
    employeeOnboarding.done = dto.done ?? false;

    try {
      const savedAssignment = await this.employeeOnboardingRepository.save(
        employeeOnboarding
      );

      const fullAssignment =
        await this.employeeOnboardingRepository.findOneByCompositeKeyWithRelations(
          savedAssignment.onboardingId,
          savedAssignment.employeeEmail
        );

      if (fullAssignment) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        console.log("SendGrid API Key:", process.env.SENDGRID_API_KEY);

        const msg = {
          to: fullAssignment.employeeEmail,
          from: "porcelanic0907@gmail.com",
          subject: `Asignación onboarding '${fullAssignment.onboarding.name}'`,
          text: "and easy to do anywhere, even with Node.js",
          html: `
            <h2>¡Hola, ${fullAssignment.employee.name}!</h2>
            <p>Te informamos que has sido asignado al proceso de onboarding <strong>"${fullAssignment.onboarding.name}"</strong>.</p>
            <ul>
            <li><strong>Tipo de onboarding:</strong> ${fullAssignment.onboarding.onboardingType.name}</li>
            <li><strong>Descripción:</strong> ${fullAssignment.onboarding.onboardingType.description}</li>
            <li><strong>Fecha de inicio:</strong> ${fullAssignment.onboarding.startDate}</li>
            <li><strong>Fecha de finalización:</strong> ${fullAssignment.onboarding.endDate}</li>
            </ul>
            <p>Por favor, revisa los detalles y prepárate para tu proceso de integración.</p>
            <p>¡Bienvenido a bordo!</p>
        `,
        };
        sgMail.send(msg).then(() => {
          console.log("Email sent");
        });
      }

      return {
        employeeOnboarding: fullAssignment
          ? this.mapToEmployeeOnboardingDto(fullAssignment)
          : undefined,
      };
    } catch (error) {
      console.error("Error assigning employee to onboarding:", error);

      if (
        (error as any).code === "ER_DUP_ENTRY" ||
        (error as any).message?.includes("unique constraint")
      ) {
        return {
          errors: [
            `Employee ${dto.employeeEmail} is already assigned to onboarding process ID ${dto.onboardingId}.`,
          ],
          alreadyAssigned: true,
        };
      }
      return {
        errors: ["Error assigning employee to onboarding process."],
      };
    }
  }

  async updateAssignmentStatus(
    onboardingId: number,
    employeeEmail: string,
    dto: UpdateEmployeeOnboardingStatusDto
  ): Promise<UpdateAssignmentStatusResult> {
    const validationErrors = validateUpdateStatus(dto.done);
    if (validationErrors.length > 0) {
      return { errors: validationErrors };
    }

    try {
      const assignment =
        await this.employeeOnboardingRepository.findOneByCompositeKey(
          onboardingId,
          employeeEmail
        );

      if (!assignment) {
        return { notFound: true, errors: ["Assignment not found."] };
      }

      assignment.done = dto.done;
      const updatedAssignment = await this.employeeOnboardingRepository.save(
        assignment
      );
      const fullAssignment =
        await this.employeeOnboardingRepository.findOneByCompositeKeyWithRelations(
          updatedAssignment.onboardingId,
          updatedAssignment.employeeEmail
        );
      return {
        employeeOnboarding: fullAssignment
          ? this.mapToEmployeeOnboardingDto(fullAssignment)
          : undefined,
      };
    } catch (error) {
      console.error("Error updating assignment status:", error);
      return { errors: ["Error updating assignment status."] };
    }
  }

  async getAssignment(
    onboardingId: number,
    employeeEmail: string
  ): Promise<GetAssignmentResult> {
    try {
      const assignment =
        await this.employeeOnboardingRepository.findOneByCompositeKeyWithRelations(
          onboardingId,
          employeeEmail
        );

      if (!assignment) {
        return { notFound: true, errors: ["Assignment not found."] };
      }
      return {
        employeeOnboarding: this.mapToEmployeeOnboardingDto(assignment),
      };
    } catch (error) {
      console.error("Error retrieving assignment:", error);
      return { errors: ["Error retrieving assignment."] };
    }
  }

  async getAssignmentsForEmployee(
    employeeEmail: string
  ): Promise<GetAssignmentsListResult> {
    try {
      const assignments =
        await this.employeeOnboardingRepository.findByEmployeeEmail(
          employeeEmail
        );
      return {
        employeeOnboardings: assignments.map((eo) =>
          this.mapToEmployeeOnboardingDto(eo)
        ),
      };
    } catch (error) {
      console.error("Error retrieving assignments for employee:", error);
      return { errors: ["Error retrieving assignments for employee."] };
    }
  }

  async getAssignmentsForOnboarding(
    onboardingId: number
  ): Promise<GetAssignmentsListResult> {
    try {
      const assignments =
        await this.employeeOnboardingRepository.findByOnboardingId(
          onboardingId
        );
      return {
        employeeOnboardings: assignments.map((eo) =>
          this.mapToEmployeeOnboardingDto(eo)
        ),
      };
    } catch (error) {
      console.error(
        "Error retrieving assignments for onboarding process:",
        error
      );
      return {
        errors: ["Error retrieving assignments for onboarding process."],
      };
    }
  }

  async unassignEmployee(
    onboardingId: number,
    employeeEmail: string
  ): Promise<UnassignEmployeeResult> {
    try {
      const assignmentExists =
        await this.employeeOnboardingRepository.findOneByCompositeKey(
          onboardingId,
          employeeEmail
        );

      if (!assignmentExists) {
        return {
          notFound: true,
          errors: ["Assignment not found to delete."],
        };
      }

      await this.employeeOnboardingRepository.deleteByCompositeKey(
        onboardingId,
        employeeEmail
      );
      return { success: true };
    } catch (error) {
      console.error("Error unassigning employee:", error);
      return { success: false, errors: ["Error unassigning employee."] };
    }
  }
}
