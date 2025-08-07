import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../../stores/store';

interface Props {
  allowedRoles: string[];
}

export default function RequireRole({ allowedRoles }: Props) {
  const { userStore } = useStore(); 
  const user = userStore.curentUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.uloga)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
