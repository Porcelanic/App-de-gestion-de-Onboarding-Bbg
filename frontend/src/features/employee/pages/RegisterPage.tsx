import React from "react";
import { RegisterForm } from "../components/children/RegisterForm";
import { StandaloneFormTemplate } from "../../../shared/templates/StandaloneFormTemplate";

export const RegisterPage: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <StandaloneFormTemplate
            title="Registrar usuario"
            backgroundImageUrl="/imgs/bdb.jpg"
        >
            <RegisterForm />
        </StandaloneFormTemplate>
    </div>
);
