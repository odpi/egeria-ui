// import React from "react";
// import {getComponent} from "../../../helpers/commons";
// import {egeriaFetch} from "../../../helpers/egeria-fetch";
// import NameSuggestions from "./name-suggestions";
// import TypesSuggestions from "./types-suggestions";
// import {IconButton, Tooltip} from "@mui/material";
// import HelpIcon from '@mui/icons-material/Help';
// import {itemName} from "../../Assets/Catalog/helpers";
// import ReactDOM from "react-dom";
// import QualifiedName from "../../Assets/Catalog/qualified-name";
// import {authHeaderWithContentType} from "../../../helpers/auth-header";


// interface Props {
// }

// interface State {
//     data: any;
//     isLoading: Boolean;
//     inputBoxes: Array<any>;
//     numberOfBoxes: number;
// }

// /**
//  *
//  * React component used to search the lineage database
//  *
//  * @since      0.1.0
//  * @access     public
//  *
//  */
// class LineageViewer extends React.Component<Props, State> {
//     constructor(props: Props) {
//         super(props);
//         this.state = {
//             data: [],
//             isLoading: false,
//             inputBoxes: [],
//             numberOfBoxes: 0,
//         };
//     }
//     componentDidMount() {
//         const displayName: any = getComponent('#display-name');
//         const qualifiedName: any = getComponent('#qualified-name');

//         displayName.renderer = (root: any, grid: any, rowData: any) => {
//             root.innerHTML = `<a href="${process.env.REACT_APP_ROOT_PATH}/assets/${rowData.item.guid}/details" target="_blank">${itemName(rowData.item)}</a>`;
//         };

//         qualifiedName.renderer = (root: any, grid: any, rowData: any) => {
//             ReactDOM.render(<QualifiedName qualified={rowData.item.qualifiedName}/>, root);
//         };
//     }

//     addMoreOptions() {
//         let typeId = "type-name-add-more-" + this.state.numberOfBoxes;
//         let nameId = "name-add-more-" + this.state.numberOfBoxes;
//         let inputBoxes = this.state.inputBoxes;

//         let div =
//             <div className="content flex row">
//                 <div className="m5 flex column">
//                     <TypesSuggestions itemId={typeId} searchedItem={false}/>
//                 </div>
//                 <div className="m5 flex column">
//                     <NameSuggestions itemId={nameId} searchedItem={false}/>
//                 </div>
//             </div>;

//         inputBoxes.push(div);

//         this.setState({
//                 inputBoxes: inputBoxes,
//                 numberOfBoxes: this.state.numberOfBoxes + 1
//             }
//         )
//     }

//     removeMoreOptions() {
//         let currentInputBoxes = this.state.inputBoxes;
//         currentInputBoxes.pop();
//         this.setState({
//                 inputBoxes: currentInputBoxes,
//                 numberOfBoxes: this.state.numberOfBoxes - 1
//             }
//         )
//     }

//     submit() {
//         const combobox: any = getComponent('#type-name-looking');
//         const namebox: any = getComponent('#name-looking');

//         const relatedType: any = getComponent('#type-name-related');
//         const relatedName: any = getComponent('#name-related');

//         let nodeType = combobox.value
//         let name = namebox.value;
//         let relTypeInfo = relatedType.value;
//         let relNameInfo = relatedName.value;
//         let body = this.getSearchBody(relNameInfo, relTypeInfo, name, nodeType);

//         let url = '/api/lineage/entities/search';
//         this.setState({
//                 isLoading: true
//             }, () =>
//                 egeriaFetch(url, 'POST', authHeaderWithContentType(), {'body' : JSON.stringify(body)}).then(response => {
//                     return response.json();
//                 }).then(data => {
//                     this.setState({
//                         data: data,
//                         isLoading: false
//                     });
//                 }).catch(() => {
//                     // TODO: handle event for future generic alert implementation
//                     this.setState({
//                         isLoading: false
//                     });
//                 })
//         )
//     }

//     private getSearchBody(relNameInfo: string, relTypeInfo: string, name: string, nodeType: string) {
//         let firstRelatedNode = {
//             name: relNameInfo ? relNameInfo : "",
//             type: relTypeInfo ? relTypeInfo : ""
//         }

//         let relatedNodes = [];
//         if (firstRelatedNode.type !== undefined && firstRelatedNode.type !== null && firstRelatedNode.type !== "") {
//             relatedNodes.push(firstRelatedNode);
//         }
//         this.getRelatedNodes(relatedNodes);

//         return {
//             queriedNode: {
//                 name: name,
//                 type: nodeType
//             },
//             relatedNodes: relatedNodes
//         };
//     }

//     private getRelatedNodes(relatedNodes: any[]) {
//         for (let i = 0; i < this.state.numberOfBoxes; i++) {
//             const component: any = getComponent('#type-name-add-more-' + i);
//             const relatedName22: any = getComponent('#name-add-more-' + i);
//             let localNodeInfo = {
//                 name: "",
//                 type: ""
//             }
//             if (component !== null) {
//                 localNodeInfo.type = component.value
//             }
//             if (relatedName22 !== null) {
//                 localNodeInfo.name = relatedName22.value
//             }
//             if (localNodeInfo.type !== undefined && localNodeInfo.type !== "") {
//                 relatedNodes.push(localNodeInfo);
//             }
//         }
//     }


//     renderBreadcrumb() {
//         return (<></>
//             // <bx-breadcrumb role="nav">
//             //     <bx-breadcrumb-item role="listitem">
//             //         <bx-breadcrumb-link href={process.env.REACT_APP_ROOT_PATH}>Home</bx-breadcrumb-link>
//             //     </bx-breadcrumb-item>

//             //     <bx-breadcrumb-item role="listitem">
//             //         <bx-breadcrumb>Lineage</bx-breadcrumb>
//             //     </bx-breadcrumb-item>

//             //     <bx-breadcrumb-item role="listitem">
//             //         <bx-breadcrumb-link href={`${process.env.REACT_APP_ROOT_PATH}/lineage/viewer`} size="">Viewer
//             //         </bx-breadcrumb-link>
//             //     </bx-breadcrumb-item>
//             // </bx-breadcrumb>
//         );
//     }

//     render() {
//         const {data, isLoading} = this.state;
//         return (
//             <div className={`flex-column${isLoading ? ' is-loading' : ''}`}>
//                 <div>
//                     {this.renderBreadcrumb()}

//                     <div className="content flex row">
//                         <div className="m5 flex column">
//                             {/* <vaadin-button id="addMoreOptions" onClick={() => this.addMoreOptions()}>+</vaadin-button> */}
//                         </div>
//                         <div className="m5 flex column">
//                             {/* <vaadin-button id="removeMoreOptions" onClick={() => this.removeMoreOptions()}>-</vaadin-button> */}
//                         </div>

//                         <div className="m5 flex column">
//                             <Tooltip title="Select a type before entering the name of the entity">
//                                 <IconButton>
//                                     <HelpIcon/>
//                                 </IconButton>
//                             </Tooltip>
//                         </div>
//                     </div>

//                     <div className="content flex row">
//                         <div className="m5 flex-column">
//                             <TypesSuggestions itemId="type-name-looking" searchedItem={true}/>
//                         </div>
//                         <div className="m5 flex-column">
//                             <NameSuggestions itemId="name-looking" searchedItem={true}/>
//                         </div>
//                     </div>

//                     <div className="content flex row">
//                         <div className="m5 flex-column">
//                             <TypesSuggestions itemId="type-name-related" searchedItem={false}/>
//                         </div>
//                         <div className="m5 flex-column">
//                             <NameSuggestions itemId="name-related" searchedItem={false}/>
//                         </div>
//                     </div>

//                     <div>
//                         {this.state.inputBoxes}
//                     </div>
//                     <div className="content flex row">

//                     </div>

//                     <div className="content flex row">

//                         <div className="m5" style={{paddingTop: 32}}>
//                             {/* <vaadin-button id="submit" onClick={() => this.submit()}>Submit</vaadin-button> */}
//                         </div>
//                     </div>

//                     <div className="content flex row flex-1">
//                         {/* <vaadin-grid items={JSON.stringify(data)} className="full-height">
//                             <vaadin-grid-sort-column id="display-name" path="displayName"
//                                                      header="Name"/>
//                             <vaadin-grid-sort-column id="type" path="nodeType" header="Type"/>
//                             <vaadin-grid-sort-column id="qualified-name" path="qualifiedName"
//                                                      header="Context Info"/>
//                         </vaadin-grid> */}
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default LineageViewer;
export {};