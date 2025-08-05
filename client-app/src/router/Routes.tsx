import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import HomePage from "../features/HomePage/HomePage";
import CreatePage from "../features/CreatePage/CreatePage";
import LoginForm from "../features/LoginRegister/LoginForm";
import RegisterForm from "../features/LoginRegister/RegisterForm";
import PlanVacation from "../features/PlanVacation/PlanVacation";

export const routes: RouteObject[] = [
    {
        path:"/",
        element: <App/>,
        children:[
            {path:'', element:<HomePage/>},
            {path:'kreiraj', element:<CreatePage/>},
            {path: 'login', element:<LoginForm />},
            {path: 'register', element:<RegisterForm />},
            {path: 'isplanirajOdmor', element:<PlanVacation />}
        ]
    }
    
    
]
export const router = createBrowserRouter(routes);  