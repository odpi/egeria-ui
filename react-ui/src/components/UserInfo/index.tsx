import React from "react";
import { authenticationService } from '../../services/authentication.service';

interface Props {
}

interface State {
  displayName: string;
}

/**
 *
 * React component used for displaying UserInfo from JWT Token.
 *
 * @since      0.1.0
 * @access     public
 *
 */
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