import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Fab from "@material-ui/core/Fab";
import CreateJob from "./createJob"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';

const columns = [
    { id: 'student_name', label: 'Student Name', minWidth: 70 },
    { id: 'student_college', label: 'College', minWidth: 100 },
    { id: 'applied_on', label: 'Applied On', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'edit', label: '', minWidth: 100 }
];

class Applications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            page: 0,
            rowsPerPage: 5,
            enableCreate: false
        }
        this.viewApplicants = this.viewApplicants.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        console.log(params.jobId)
        let url = 'http://localhost:8080/company/' + sessionStorage.getItem("id") + '/job/' + params.jobId + '/applicants';
        console.log(url)
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    this.setState({
                        applications: response.data
                    })
                } else {
                    this.setState({
                        applications: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    applications: []
                })
            });
    }
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0
        })
    };

    toggleCreate = () => {
        this.setState({
            enableCreate: !this.state.enableCreate
        })
    }

    viewApplicants = event => {
        console.log(event.target.id)
    }
    render() {
        let createDialog = null;
        let errorBanner = null;
        if (this.state.applications.length === 0) errorBanner = (<b>No Applicants for this Job</b>)
        return (
            <div className="container" style={{ width: "85%", alignItems: "center" }}>
                {createDialog}
                <div>
                    <Link to="/signin">
                        <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "grey" }} onClick={this.toggleCreate} >
                            <ArrowBackIcon fontSize="large"/><b style={{ fontSize: "10px" }}>Back to Jobs</b>
                        </Fab>
                    </Link>
                    <br /><br />
                </div>
                <Paper style={{ width: "100%", align: "center", backgroundColor: "rgb(242, 242, 242)" }}>
                    <TableContainer style={{ maxHeight: "80%" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, backgroundColor: "rgb(225, 225, 225)", fontWeight: "bold", fontSize: "13px" }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.applications.map(row => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map(column => {
                                                let value = row[column.id];
                                                if (column.id === "applied_on") value = moment(value).format("dddd, MMMM Do YYYY");
                                                if (column.id === "edit") {
                                                    return (
                                                        <TableCell style={{ fontSize: "10px" }} onClick={this.viewApplicants} id={row["id"]}>
                                                            {value}
                                                        </TableCell>
                                                    )
                                                }
                                                return (
                                                    <TableCell key={column.id} align={column.align} style={{ fontSize: "10px" }}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={this.state.applications.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
            </div>
        )
    }
}

export default Applications;