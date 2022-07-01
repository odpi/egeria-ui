import React from 'react';

import {
  Alert,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput
} from '@mantine/core';

import { AlertCircle } from 'tabler-icons-react';

import { authenticationService } from '../../services/authentication.service';

interface Props {}
interface State {
  errors: Array<string>
  isLoading: Boolean
  username: string
  password: string
}

export class EgeriaLogin extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      errors: [],
      isLoading: false,
      password: '',
      username: ''
    }
  }

  handleSubmit = () => {
    const { username, password } = this.state;

    this.setState({
      isLoading: true
    }, () => {
      authenticationService.login(username, password).then((response) => {
        let errors = [];

        if (!response.ok) {
          switch (response.status){
            case 401:
              errors.push('Wrong credentials!');
              break;
            case 403:
              errors.push('You are not authorized to access this application.');
              break;
            default:
              errors.push('Ops! Cannot authenticate right now.');
              break;
          }
          this.setState({
            errors,
            isLoading: false
          });
        } else {
          window.location.href = `${process.env.REACT_APP_HOMEPAGE}`;
        }
      });
    });
  }

  render() {
    const { errors, username, password } = this.state;

    return (
      <Container size={420} my={40}>
        <Group
          align="center"
          className="egeria-logo"
        >
          <img src="/egeria-logo.svg" alt="Egeria" title="Egeria" />
        </Group>

        { errors.length > 0 && <Group mt={30}>
          <Alert style={{width:420}} icon={<AlertCircle size={16} />} title="Bummer!" color="red" radius="md" variant="outline">
            { errors.map((e, key) => <p key={key}>{e}</p>) }
          </Alert>
        </Group> }

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="Your username"
            required
            value={username}
            onChange={(event) => this.setState({username: event.currentTarget.value})} />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(event) => this.setState({password: event.currentTarget.value})} />

          <Button fullWidth mt="xl" onClick={() => this.handleSubmit()}>
            Sign in
          </Button>
        </Paper>
      </Container>
    );
  }
}
