import React from "react";
import { authenticationService } from '../../services/authentication.service';
import logo from '../../egeria-logo.png';

interface Props {
}

interface State {
  form: {
    username: string,
    password: string
  },
  currentUserValue: any
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      form: {
        username: '',
        password: ''
      },
      currentUserValue: authenticationService.currentUserValue
    };
  }

  onSubmit() {
    const { form } = this.state;

    authenticationService.login(form.username, form.password).then(() => {
      this.setState({
        currentUserValue: authenticationService.currentUserValue
      });

      window.location.href = "/react-ui";
    });
  }

  onLogout() {
    authenticationService.logout();

    this.setState({
      currentUserValue: authenticationService.currentUserValue
    });
  }

  onUpdateFormKey(key: string, value: string) {
    const { form } = this.state;

    this.setState({
      form: {
        ...form,
        [key]: value
      }
    });

    console.log(form);
  }

  render() {
    return (
      <div className="login-page">
        <div className="logo-container">
          <img src={ logo } alt="Egeria" className="logo"/>
        </div>

        <div className="login-container">
          <label htmlFor="username"><b>Username</b></label>
          <input id="username"
                 placeholder="Enter Username"
                 type="text"
                 name="username"
                 value={this.state.form.username}
                 onChange={e => this.onUpdateFormKey('username', e.target.value)}
                 required />


          <label htmlFor="password"><b>Password</b></label>
          <input id="password"
                 placeholder="Enter Password"
                 type="password"
                 name="password"
                 value={this.state.form.password}
                 onChange={e => this.onUpdateFormKey('password', e.target.value)}
                 required />

          <button onClick={() => this.onSubmit()}>Login</button>
          <label>
            <input type="checkbox" name="remember" checked/> Remember me
          </label>
        </div>
      </div>
    );
  }
}

export default Login;