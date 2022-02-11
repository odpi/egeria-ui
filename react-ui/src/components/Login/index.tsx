import React from "react";
import { authenticationService } from '../../services/authentication.service';
import logo from '../../egeria-logo.png';

interface Props {
}

interface State {
  isLoading: Boolean,
  goodCredentials: Boolean,
  form: {
    username: string,
    password: string
  },
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
class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: false,
      goodCredentials: true,
      form: {
        username: '',
        password: ''
      },
      currentUserValue: authenticationService.currentUserValue
    };
  }

  onSubmit() {
    const { form } = this.state;

    this.setState({
      isLoading: true
    });

    authenticationService.login(form.username, form.password).then((response) => {
      if(!response.ok) {
        this.setState({
          goodCredentials: false,
          form: {
            username: '',
            password: ''
          }
        });
      } else {
        window.location.href = "/react-ui";
      }

      this.setState({
        isLoading: false
      });
    });
  }

  handleKeyPress = (event: any) => {
    if(event.key === 'Enter'){
      this.onSubmit();
    }
  }

  onLogout() {
    authenticationService.logout();
  }

  onUpdateFormKey(key: string, value: string) {
    const { form } = this.state;

    this.setState({
      form: {
        ...form,
        [key]: value
      }
    });
  }

  render() {
    const { goodCredentials, isLoading } = this.state;

    return (
      <div className="login-page">
        <div className="logo-container">
          <img src={ logo } alt="Egeria" className="logo"/>
        </div>

        <div className={`login-container ${isLoading ? 'is-loading' : ''}`}>
          { !goodCredentials && <div className="error">
            <p>Username or password is incorrect.</p>
          </div> }

          <label htmlFor="username"><b>Username</b></label>
          <input id="username"
                 placeholder="Enter Username"
                 type="text"
                 name="username"
                 value={this.state.form.username}
                 onChange={e => this.onUpdateFormKey('username', e.target.value)}
                 onKeyPress={this.handleKeyPress}
                 required />


          <label htmlFor="password"><b>Password</b></label>
          <input id="password"
                 placeholder="Enter Password"
                 type="password"
                 name="password"
                 value={this.state.form.password}
                 onChange={e => this.onUpdateFormKey('password', e.target.value)}
                 onKeyPress={this.handleKeyPress}
                 required />

          <button onClick={() => this.onSubmit()}>Login</button>
        </div>
      </div>
    );
  }
}

export default Login;