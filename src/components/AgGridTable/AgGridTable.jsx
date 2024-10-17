/**
 * 
 * AgGridTable component.
 * 
 * This component is used to manage the aggrid table.Used the grid api to manage the events.
 *
 *
 */

import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

export default class AgGridTable extends Component {
  constructor(props) {
    super(props);


    this.state = {
      columnDefs: [],
      overlayLoadingTemplate: '<span className="ag-overlay-loading-center">Loading</span>',
      overlayNoRowsTemplate: "<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">Loading</span>",
      getRowHeight: function (params) {
        return 50;
      }
    }
  }

  /* Used this function to listen grid events and update the table. */
  onGridReady = params => {
    this.props.onGridReady(params)
  }

  /* Used this function to manage the grid size change. */
  onGridSizeChanged = params => {
    this.props.onGridReady(params)
  }

  /* Used to render the data in the aggrid table. */
  onFirstDataRendered = params => {
    this.props.onGridReady(params)
  }

  /* Used to manage the filters in the aggrid table. */
  onFilterChanged = params => {
    this.props.onFilterChanged(params)
  }


  render() {

    return (

      <div
        id="myGrid"
        style={{
          height: "100%",
          width: "100%"
        }}
        className="ag-theme-balham"
      >
        <AgGridReact
          // domLayout={"autoHeight"}
          suppressMenuHide={true}
          onGridReady={this.onGridReady}
          onGridSizeChanged={this.onGridSizeChanged}
          onFirstDataRendered={this.onFirstDataRendered}
          onRowDataChanged={this.props.onRowDataChanged}
          columnDefs={this.props.columnDefs}
          // defaultColDef={this.state.defaultColDef}
          rowData={this.props.rowdata}
          frameworkComponents={this.state.frameworkComponents}
          pagination={this.props.pagination}
          paginationPageSize={this.props.paginationPageSize}
          suppressPaginationPanel={this.props.suppressPaginationPanel}
          // paginationAutoPageSize={true}
          onCellClicked={this.props.onCellClicked}
          quickFilterText={this.props.quickFilterText}
          handleChecked={this.props.handleChecked}
          updateRowData={this.props.updateRowData}
          getRowHeight={this.state.getRowHeight}
          onFilterChanged={this.onFilterChanged}
          // overlayLoadingTemplate={this.state.overlayLoadingTemplate}
          overlayNoRowsTemplate={this.state.overlayNoRowsTemplate}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            lockPosition: true,
            autoHeight: true
          }}
          gridOptions={{ suppressHorizontalScroll: false}}
        />
      </div>

    )
  }


}