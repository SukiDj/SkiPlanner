import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import HomePage from "../features/HomePage/HomePage";
import CreatePage from "../features/CreatePage/CreatePage";
import LoginForm from "../features/LoginRegister/LoginForm";
import RegisterForm from "../features/LoginRegister/RegisterForm";
import PlanVacation from "../features/PlanVacation/PlanVacation";
import RequireRole from "../features/RequireRole/RequireRole";

export const routes: RouteObject[] = [
    {
        path:"/",
        element: <App/>,
        children:[
            {path:'', element:<HomePage/>},
            {path: 'login', element:<LoginForm />},
            {path: 'register', element:<RegisterForm />},
            {path: 'isplanirajOdmor', element:<PlanVacation />},
            {
                element: <RequireRole allowedRoles={["RadnikNaSkijalistu"]} />,
                children:[
                    {path:'kreiraj', element:<CreatePage/>},
                ]
            }
        ]
    }
    
    
]
export const router = createBrowserRouter(routes);  