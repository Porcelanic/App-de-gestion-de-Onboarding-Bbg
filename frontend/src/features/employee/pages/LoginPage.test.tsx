import { render, screen } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { StandaloneFormTemplate } from "../../../shared/templates/StandaloneFormTemplate";
import { LoginForm } from "../components/children/LoginForm";

jest.mock("../../../shared/templates/StandaloneFormTemplate", () => ({
    StandaloneFormTemplate: jest.fn(
        ({ title, backgroundImageUrl, children }) => (
            <div
                data-testid="standalone-form-template"
                data-title={title}
                data-backgroundimageurl={backgroundImageUrl}
            >
                {children}
            </div>
        )
    ),
}));

jest.mock("../components/children/LoginForm", () => ({
    LoginForm: jest.fn(() => <div data-testid="login-form">LoginForm</div>),
}));

describe("LoginPage", () => {
    beforeEach(() => {
        (StandaloneFormTemplate as jest.Mock).mockClear();
        (LoginForm as jest.Mock).mockClear();
    });

    test("renders correctly", () => {
        render(<LoginPage />);

        expect(
            screen.getByTestId("standalone-form-template")
        ).toBeInTheDocument();
    });

    test("renders LoginForm child component", () => {
        render(<LoginPage />);
        expect(screen.getByTestId("login-form")).toBeInTheDocument();
        expect(LoginForm).toHaveBeenCalledTimes(1);
    });
});
