import React from 'react';
import { HeaderSearch } from '../Header';
import { NavbarMinimal } from '../NavbarMinimal';

interface Props {
}

interface State {
}

/**
 *
 * React component used for handling the root routing mechanism.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class Layout extends React.Component<Props, State> {
  render() {
    return <>
    <div className="egeria-wrapper">
      <NavbarMinimal />

      <div className="header">
        <HeaderSearch links={[{link: '/profile', label: 'Profile'}, {link: '/about', label: 'About'}]} />
      </div>
    </div>
    </>;
  }
}

export default Layout;
