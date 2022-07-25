import React from "react";
// import 'carbon-web-components/es/components/data-table';
// import 'carbon-web-components/es/components/breadcrumb';
import { egeriaFetch, authHeader } from 'egeria-ui-core';

interface Props {
  match: any;
}

interface State {
  asset: any;
}

/**
 *
 * React component used for AssetDetails.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class AssetDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      asset: null
    };
  }

  componentDidMount() {
    const { match } = this.props;

    egeriaFetch(`/api/assets/${ match.params.uuid }`, 'GET', authHeader(), {}).then(data => {
      return data.json();
    }).then(data => {
      this.setState({
        asset: data
      });
    });
  }

  getProperties(object: any, key: string) {
    if(object && object[key]) {
      return Object.keys(object[key]);
    } else {
      return [];
    }
  }

  renderTable(column: string, object: any, key: string) {
    if(object && object[key]) {
      return (<></>
        // <bx-data-table>
        //   <bx-table>
        //     <bx-table-head>
        //       <bx-table-header-row>
        //         <bx-table-header-cell>{ column }</bx-table-header-cell>
        //         <bx-table-header-cell></bx-table-header-cell>
        //       </bx-table-header-row>
        //     </bx-table-head>
        //     <bx-table-body>
        //       { object && this.getProperties(object, key).map((p: any) => {
        //           return (
        //             <bx-table-row key={p}>
        //               <bx-table-cell><strong>{ p }</strong></bx-table-cell>
        //               <bx-table-cell>{ object[key][p] }</bx-table-cell>
        //             </bx-table-row>
        //           );
        //         })
        //       }
        //     </bx-table-body>
        //   </bx-table>
        // </bx-data-table>
      );
    }
  }

  renderBreadcrumbSample() {
    // const { match } = this.props;

    return(<></>
    //   <bx-breadcrumb role="nav">
    //     <bx-breadcrumb-item role="listitem">
    //       <bx-breadcrumb-link href={`${process.env.REACT_APP_ROOT_PATH}`} size="">Home</bx-breadcrumb-link>
    //     </bx-breadcrumb-item>

    //     <bx-breadcrumb-item role="listitem">
    //       <bx-breadcrumb-link href={`${process.env.REACT_APP_ROOT_PATH}/assets/catalog`} size="">Catalog</bx-breadcrumb-link>
    //     </bx-breadcrumb-item>

    //     <bx-breadcrumb-item role="listitem">
    //       <bx-breadcrumb-link href={`${process.env.REACT_APP_ROOT_PATH}/assets/${ match.params.uuid }/details`}>{ match.params.uuid }</bx-breadcrumb-link>
    //     </bx-breadcrumb-item>

    //     <bx-breadcrumb-item role="listitem">
    //       <bx-breadcrumb-link aria-current="page" size="">details</bx-breadcrumb-link>
    //     </bx-breadcrumb-item>
    // </bx-breadcrumb>
    );
  }

  render() {
    // const { asset } = this.state;

    return (<></>
      // <div>
      //   { this.renderBreadcrumbSample() }
      //   <br/>
      //   { this.renderTable('Properties', asset, 'properties') }
      //   <br/>
      //   <br/>
      //   { this.renderTable('Type', asset, 'type') }
      //   <br/>
      //   <br/>
      //   { this.renderTable('Origin', asset, 'origin') }
      // </div>
    );
  }
}

export default AssetDetails;