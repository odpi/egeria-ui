import React from 'react';

interface Props {
  zoomIn?: Function;
}

interface State {
}

/**
 *
 * React component used for displaying Action buttons.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class HappiGraphActions extends React.Component<Props, State> {
  render() {
    return (<>
      <button>Click me</button>
    </>);
  }
}

export default HappiGraphActions;