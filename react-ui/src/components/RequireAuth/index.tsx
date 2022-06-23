import {
  Navigate
} from 'react-router-dom';
import { authenticationService } from '../../services/authentication.service';

export function RequireAuth(props: any) {
  const { children } = props;

  const currentJwt = authenticationService.currentJwt();

  if (currentJwt) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
