import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  redirect,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import React from "react";
import App from "./App";
import Layout from "./Layout";
import Loader from "./components/Loader";
import ErrorPage from "./ErrorPage";
// Lazy imports
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const SearchPage = lazy(() => import("./components/SearchPage"));
const Hb = lazy(() => import("./Hb"));
const ReadBlog = lazy(() => import("./components/ReadBlog"));
const NewBlog = lazy(() => import("./components/NewBlog"));
const Update = lazy(() => import("./components/UpdateBlog"));
const LoginForm = lazy(() => import("./components/Users/Login"));
const SignupForm = lazy(() => import("./components/Users/SignUp"));

const API = import.meta.env.VITE_API_BASE_URL;

// Logout logic
const logoutLoader = async () => {
  const token = localStorage.getItem("token");

  try {
    await fetch(`${API}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }

  localStorage.removeItem("token");
  return redirect("/");
};

// UUID token verification loader
const validateUUID = async ({ params }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found");
    throw redirect("/login");
  }

  const res = await fetch(`${API}/verify/uuid/${params.uuid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.warn("Token invalid or UUID check failed");
    throw redirect("/login");
  }

  return res.json();
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>

      {/* 👇 Main App layout */}
      <Route path="/" element={<App />} errorElement={<ErrorPage />}>
        <Route index element={<Layout />} />

        <Route
          path="dashboard/:userName/:uuid"
          element={
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          }
          loader={validateUUID}
          errorElement={<ErrorPage />}
        />

        <Route
          path="search"
          element={
            <Suspense fallback={<Loader />}>
              <SearchPage />
            </Suspense>
          }
        />

        <Route
          path="read/:pid"
          element={
            <Suspense fallback={<Loader />}>
              <ReadBlog />
            </Suspense>
          }
        />

        <Route
          path="new/:username/:uuid"
          element={
            <Suspense fallback={<Loader />}>
              <NewBlog />
            </Suspense>
          }
        />

        <Route
          path="update/:username/:uuid/:pid/"
          element={
            <Suspense fallback={<Loader />}>
              <Update />
            </Suspense>
          }
        />


        <Route
          path="login"
          element={
              <LoginForm />
          }
        />

        <Route
          path="signup"
          element={
              <SignupForm />
          }
        />

        <Route path="logout" loader={logoutLoader} />
        <Route
          path="thebigboss"
          element={
            <Suspense fallback={<Loader />}>
              <Hb />
            </Suspense>
          }
        />
        <Route path="404" element={<ErrorPage />} />
      </Route>
    </>
  )
);

export default router;
