import React from "react"
import ReactDOM from "react-dom/client"
import Index from "./components/views/Index.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Register from "./components/views/Register.jsx"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import Callback from "./components/views/Callback.jsx"

const client = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/callback",
        element: <Callback />
    }
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={client}>
        <RouterProvider router={router} />
    </QueryClientProvider>
)
