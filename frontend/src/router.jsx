import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import ArticleListPage from "./pages/ArticleListPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import EditBlogPage from "./pages/EditBlogPage";
import DashboardPage from "./pages/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ArticleListPage /> },
      { path: "read/:pid", element: <ArticleDetailPage /> },
      { path: "whoshnri", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "dashboard/:username/:uuid", element: <DashboardPage /> },
      { path: "dashboard/:username/:uuid/new", element: <CreateBlogPage /> },
      { path: "dashboard/:username/:uuid/edit/:pid", element: <EditBlogPage /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

export default router;
