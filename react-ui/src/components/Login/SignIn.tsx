import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { authenticationService } from '../../services/authentication.service';
import logo from '../../egeria-logo.png';


interface Props {
}


interface State {

    isLoading: Boolean,
    errors: Map<string, boolean>,
    feedbackMessage: String,
    currentUserValue: any
}

/**
 *
 * React component used for displaying login form.
 *
 * @since      0.1.0
 * @access     public
 *
 */

const theme = createTheme();

class SignIn extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            errors: new Map<string, boolean>(),
            feedbackMessage: 'Sign in',
            currentUserValue: authenticationService.currentUserValue
        };
    }

    /**
     * handles the submit
     * @param event of the react form
     */
    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let { errors, feedbackMessage } = this.state;
        let username = String(data.get('username'));
        let password = String(data.get('password'));

        errors.set('username',username ==='');
        errors.set('password', password ==='');

        this.setState({errors});

        // check if the form has validation errors
        let hasErrors = Array.from(errors.values()).find((item) => item);

        if( ! hasErrors ){
            authenticationService.login( username, password).then((response) => {
                if (!response.ok) {
                    switch (response.status){
                        case 401 : feedbackMessage = "Wrong credentials!"; break;
                        case 403 : feedbackMessage = "You are not authorized to access this application."; break;
                        default : feedbackMessage = "Ops! Cannot authenticate right now."; break;
                    }
                    this.setState({feedbackMessage});
                } else {
                    window.location.href = "/react-ui";
                }

                this.setState({
                    isLoading: false
                });
            });
        }

    };

    render() {
        const { errors, feedbackMessage } = this.state;

        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <img src={ logo } alt="Egeria" className="logo"/>
                        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {feedbackMessage}
                        </Typography>
                        <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="off"
                                aria-errormessage="required"
                                autoFocus
                                error={errors.get('username')}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                inputProps={{
                                    style: {
                                        border: 'none',
                                        padding: '20px',
                                    }
                                }} // workaround a bug in TextField
                                error={errors.get('password')}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                Sign In
                            </Button>

                        </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{mt: 8, mb: 4}}>
                        {'Powered by : '}
                        <Link color="inherit" href="https://egeria-project.org/">
                            Egeria
                        </Link>
                    </Typography>
                </Container>
            </ThemeProvider>
        );
    }
}

export default SignIn;