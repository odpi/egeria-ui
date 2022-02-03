import React from "react";

interface Props {
  location: any;
}

interface State {
}

/**
 *
 * React component used for AssetCatalog.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class AssetCatalog extends React.Component<Props, State> {
  render() {
    const { location } = this.props;
    const { search } = location;

    return (
      <div>
        <p>AssetCatalog</p>
        <p>{ search }</p>
      </div>
    );
  }
}

export default AssetCatalog;