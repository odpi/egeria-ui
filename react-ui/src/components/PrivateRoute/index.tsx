import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from '../../services/authentication.service';

export const PrivateRoute = ({ component: Component, ...rest}: any) => (
    <Route {...rest} render={props => {
        const currentJwt = authenticationService.currentJwt();

        if (!currentJwt) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)