import React from "react";
import { authenticationService } from '../../services/authentication.service';

interface Props {
}

interface State {
  displayName: string;
}

class UserInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      displayName: ''
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe((user: any) => {
      if(user) {
        const userData = JSON.parse(user.sub);

        this.setState({
          displayName: userData.displayName
        });
      }
    });
  }

  render() {
    const { displayName } = this.state;

    return (
      <div>
        <span>{ displayName }</span>
      </div>
    );
  }
}

export default UserInfo;