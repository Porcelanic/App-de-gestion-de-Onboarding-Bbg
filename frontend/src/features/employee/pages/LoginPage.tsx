import React from "react";
import { LoginForm } from "../components/children/LoginForm";
import { StandaloneFormTemplate } from "../../../shared/templates/StandaloneFormTemplate";

export const LoginPage: React.FC = () => (
    <StandaloneFormTemplate title="Iniciar Sesión" backgroundImageUrl="/imgs/bdb.jpg">
        <LoginForm />
    </StandaloneFormTemplate>
);
