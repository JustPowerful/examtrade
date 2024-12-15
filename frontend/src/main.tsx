import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/components/providers/QueryProvider";
import Layout from "@/components/global/Layout";
import Dashboard from "@/pages/Dashboard";
import Browse from "@/pages/Browse";
import Upload from "@/pages/Upload";
import Home from "@/Home";

const authLoader = async () => {
  try {
    const response = await fetch("/api/auth/validate", {
      method: "POST",
    });
    if (response.ok) {
      return null;
    } else {
      throw redirect("/");
    }
  } catch (error) {
    throw redirect("/");
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <Dashboard />, loader: authLoader },
      { path: "/browse", element: <Browse />, loader: authLoader },
      { path: "/upload", element: <Upload />, loader: authLoader },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster />
    </QueryProvider>
  </StrictMode>
);
