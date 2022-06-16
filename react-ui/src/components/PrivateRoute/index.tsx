import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import { authenticationService } from '../../services/authentication.service';

/**
 *
 * React Component wrapper used to check if current user has a defined JWT so
 * that it can see the component.
 *
 * It does not validate if token is still available, this is handled at any
 * given HTTP request.
 *
 * @since      0.1.0
 * @access     public
 *
 * @param {Class}  var React component class extracted from react props.
 *
 * @return {object} Returns wrapped component or redirects to /login.
 *
 */
export const PrivateRoute = ({ component: Component, ...rest}: any) => (
    <Route {...rest} render={(props: any) => {
        const currentJwt = authenticationService.currentJwt();

        if (!currentJwt) {
            return <Navigate to={'/login'} state={{ from: props.location}} />
        }

        return <Component {...props} />
    }} />
)