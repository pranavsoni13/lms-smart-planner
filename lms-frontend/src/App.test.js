import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock(
  "react-router-dom",
  () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    Navigate: ({ to }) => <div>Redirecting to {to}</div>,
    Route: ({ element }) => element,
    Routes: ({ children }) => <div>{children}</div>,
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

test("renders the sign-in page", () => {
  localStorage.removeItem("token");
  render(<App />);
  expect(screen.getByRole("heading", { name: /sign in to your workspace/i })).toBeInTheDocument();
});