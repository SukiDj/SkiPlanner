import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import HomePage from "../features/HomePage/HomePage";
import { Children } from "react";
import CreatePage from "../features/CreatePage/CreatePage";

export const routes: RouteObject[] = [
    {
        path:"/",
        element: <App/>,
        children:[
            {path:'', element:<HomePage/>},
            {path:'kreiraj', element:<CreatePage/>}
        ]
    }
    
    
]
export const router = createBrowserRouter(routes);  