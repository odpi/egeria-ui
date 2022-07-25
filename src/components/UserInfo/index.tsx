import { currentJwt, parseJwt } from "egeria-ui-core";
import React from "react";

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
    const _currentJwt = parseJwt(currentJwt());
    const userData = JSON.parse(_currentJwt.sub);

    this.setState({
      displayName: userData.displayName
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