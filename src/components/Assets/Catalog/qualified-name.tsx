import React from 'react';
import { capitalizeFirstLetter, getIcon, parseQualifiedName } from './helpers';
import './qualified-name.scss';

interface Props {
  qualified: string
}

interface State {
}

/**
 *
 * React component used for displaying context info in Asset Catalog.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class QualifiedName extends React.Component<Props, State> {
  render() {
    const { qualified } = this.props;

    const maskImage = (item: any) => {
      return {
        width: '21px',
        height: '21px',
        WebkitMaskImage: `url(data:image/svg+xml;utf8,${encodeURIComponent(getIcon(item.key))})`
      };
    };

    return (
      <div className="qualified-name">
        <ul>
          { parseQualifiedName(qualified).map((item: any, key: number) => {
            return <li title={ capitalizeFirstLetter(item.key)} key={key}>
              <div className="masked"
                  style={maskImage(item)}>
              </div>

              <div className="label">{ item.value }</div>
            </li>
          }) }
        </ul>
      </div>
    );
  }
}

export default QualifiedName;
