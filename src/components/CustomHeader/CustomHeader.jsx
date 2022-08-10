/* 
* Custom Header component.
* This component is used to manage the column header in the aggrid table.
*/
import React, { Component } from 'react';
import "./CustomHeader.css"
//material-ui Dialog
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

export default class CustomHeader extends Component {
    constructor(props) {
        super(props);

        props.reactContainer.style.display = "inline-block";

        this.state = {
            open: false,
            activefiltermenu: []
        };

        this.HandlingEvent = this.HandlingEvent.bind(this)

    }

    ChangeActiveMenu = (menu) => {
        console.log(menu)
    }

    render() {
        let menu = null;
        if (this.props.enableMenu) {
            if (this.props.agGridReact.props.activefiltermenu && this.props.agGridReact.props.activefiltermenu.length > 0 &&
                this.props.agGridReact.props.activefiltermenu.includes(this.props.column.colId)) {
                if (this.props.column.colDef.type === 'm') {
                    menu =
                        <div ref={(menuButton) => { this.menuButton = menuButton; }}
                            className="customHeaderMenuButton">
                            {this.props.column.colDef.hidecolumn ? this.props.column.colDef.hidecolumn === "active" ?
                                <i style={{ color: 'orange' }} className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i> :
                                <i className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i> :
                                <i className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i>
                            }
                            <i style={{ color: "orange" }} className={`fa ${this.props.menuIcon}`} onClick={this.onMenuClicked.bind(this)}></i>
                            <i className={`fa ${this.props.deleteIcon}`} onClick={() => this.setState({ open: true })}></i>
                        </div>;
                }
                else if (this.props.column.colDef.type === 'preview') {
                    menu =
                        <div ref={(menuButton) => { this.menuButton = menuButton; }}
                            className="customHeaderMenuButton">
                        </div>;
                }
                else {
                    menu =
                        <div ref={(menuButton) => { this.menuButton = menuButton; }}
                            className="customHeaderMenuButton">
                            {this.props.column.colDef.hidecolumn ? this.props.column.colDef.hidecolumn === "active" ?
                                <i style={{ color: 'orange' }} className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i> :
                                <i className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i> :
                                <i className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i>
                            }
                            <i style={{ color: "orange" }} className={`fa ${this.props.menuIcon}`} onClick={this.onMenuClicked.bind(this)}></i>
                        </div>;
                }
            } else {
                if (this.props.column.colDef.type === 'm') {
                    menu =
                        <div ref={(menuButton) => { this.menuButton = menuButton; }}
                            className="customHeaderMenuButton">
                            {this.props.column.colDef.hidecolumn ? this.props.column.colDef.hidecolumn === "active" ?
                                <i style={{ color: 'orange' }} className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i> :
                                <i className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i> :
                                <i className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i>
                            }
                            <i className={`fa ${this.props.menuIcon}`} onClick={this.onMenuClicked.bind(this)}></i>
                            <i className={`fa ${this.props.deleteIcon}`} onClick={() => this.setState({ open: true })}></i>
                        </div>;
                }
                else if (this.props.column.colDef.type === 'preview') {
                    menu =
                        <div ref={(menuButton) => { this.menuButton = menuButton; }}
                            className="customHeaderMenuButton">
                        </div>;
                }
                else {
                    menu =
                        <div ref={(menuButton) => { this.menuButton = menuButton; }}
                            className="customHeaderMenuButton">
                            {this.props.column.colDef.hidecolumn ? this.props.column.colDef.hidecolumn === "active" ?
                                <i style={{ color: 'orange' }} className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i> :
                                <i className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i> :
                                <i className={`fa ${this.props.hideIcon}`} onClick={this.handlehide}></i>
                            }
                            <i className={`fa ${this.props.menuIcon}`} onClick={this.onMenuClicked.bind(this)}></i>
                        </div>;
                }
            }
        }

        return (
            <div >

                <div className="customHeaderLabel"
                    onClick={this.HandlingEvent.bind(this)}
                >{this.props.displayName}</div>
                {menu}
                <div>

                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        {/* <DialogTitle id="alert-dialog-title">{this.props.displayName}</DialogTitle> */}
                        <DialogContent
                            style={{
                                padding: "25px 40px 16px"
                            }}
                        >
                            <DialogContentText id="alert-dialog-description"
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    textTransform: "initial"
                                }}
                            >
                                Are you sure you want to delete ?
                            </DialogContentText>
                            <DialogActions
                                style={{
                                    justifyContent: "center"
                                }}>
                                <Button onClick={() => {
                                    this.setState({ open: false })
                                    this.handleDelete()
                                }} color="primary" autoFocus
                                    style={{
                                        color: "#fff",
                                        backgroundColor: "#074e9e",
                                        margin: "10px 0 0px 10px",
                                        padding: "5px 16px",
                                        fontSize: "12px"
                                    }}>
                                    Yes
                                </Button>
                                <Button onClick={() => this.setState({ open: false })} color="primary"
                                    style={{
                                        color: "#fff",
                                        backgroundColor: "#074e9e",
                                        margin: "10px 0 0px 10px",
                                        padding: "5px 16px",
                                        fontSize: "12px"
                                    }}>
                                    No
                                </Button>

                            </DialogActions>

                        </DialogContent>
                    </Dialog>
                </div>

            </div>
        );
    }

    onMenuClicked() {
        this.props.showColumnMenu(this.menuButton);
    }
    handleDelete(e) {
        this.props.agGridReact.props.onColumnDelete(this.props.column.colDef.id);
    }
    handlehide = () => {
        this.props.agGridReact.props.onColumnHide(this.props.column.colId, this.props.column.colDef.type);

    }

    HandlingEvent(event) {
        let shift = event.shiftKey

        if ((this.props.column.sort && this.props.column.sort !== 'null') || (this.props.column.sort && this.props.column.sort !== 'undefined')) {
            if (this.props.column.sort === 'asc') {
                this.props.setSort('desc', shift)
            }
            else if (this.props.column.sort === 'desc') {
                this.props.setSort('', shift)
            }
        }
        else {
            this.props.setSort('asc', shift)

        }
    }

    onMenuClick() {
        this.props.showColumnMenu(this.menuButton);
    }
}