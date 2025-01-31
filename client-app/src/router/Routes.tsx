import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import HomePage from "../features/HomePage/HomePage";
import { Children } from "react";
import CreatePage from "../features/CreatePage/CreatePage";
import LoginForm from "../features/LoginRegister/LoginForm";
import RegisterForm from "../features/LoginRegister/RegisterForm";

export const routes: RouteObject[] = [
    {
        path:"/",
        element: <App/>,
        children:[
            {path:'', element:<HomePage/>},
            {path:'kreiraj', element:<CreatePage/>},
            {path: 'login', element:<LoginForm />},
            {path: 'register', element:<RegisterForm />}
        ]
    }
    
    
]
export const router = createBrowserRouter(routes);  