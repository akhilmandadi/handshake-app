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
import AddIcon from "@material-ui/icons/Add";
import CreateJob from "./createJob"
import { Redirect } from 'react-router';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const columns = [
    { id: 'title', label: 'Title', minWidth: 70 },
    { id: 'posting_date', label: 'Posting Date', minWidth: 100 },
    { id: 'deadline', label: 'Deadline', minWidth: 100 },
    { id: 'location', label: 'Location', minWidth: 100 },
    { id: 'salary', label: 'Salary', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 100 },
    { id: 'category', label: 'Category', minWidth: 100 },
    { id: 'applicants', label: '', minWidth: 100 }
];

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            page: 0,
            rowsPerPage: 5,
            enableCreate: false,
            jobId: ""
        }
        this.viewApplicants = this.viewApplicants.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
        this.updateJobs = this.updateJobs.bind(this);
    }

    componentDidMount() {
        this.updateJobs();
        // let url = 'http://localhost:8080/company/' + sessionStorage.getItem("id") + '/jobs';
        // axios.defaults.withCredentials = true;
        // axios.get(url)
        //     .then(response => {
        //         if (response.status === 200) {
        //             this.setState({
        //                 jobs: response.data
        //             })
        //         } else {
        //             this.setState({
        //                 jobs: []
        //             })
        //         }
        //     })
        //     .catch((error) => {
        //         this.setState({
        //             jobs: []
        //         })
        //     });
    }
    updateJobs = () => {
        let url = 'http://localhost:8080/company/' + sessionStorage.getItem("id") + '/jobs';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        jobs: response.data
                    })
                } else {
                    this.setState({
                        jobs: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    jobs: []
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

    viewApplicants = id => {
        this.setState({
            jobId: id
        })

    }
    render() {
        let createDialog = null;
        if (this.state.enableCreate) createDialog = (<CreateJob toggleCreate={this.toggleCreate} enableCreate={this.state.enableCreate} updateJobs={this.updateJobs} />)
        else createDialog = null;

        let jobApplicants = null;
        if (this.state.jobId !== "") { const url = '/job/' + this.state.jobId + '/applications'; jobApplicants = <Redirect to={url} /> }
        let errorBanner = null;
        if (this.state.jobs.length === 0) errorBanner = (<b>No Jobs Posted Currently</b>)
        return (
            <div className="container" style={{ width: "85%", align: "center" ,marginTop:"20px"}}>
                {createDialog}
                {jobApplicants}
                <div>
                    <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "grey" }} onClick={this.toggleCreate} >
                        <AddIcon /><b style={{ fontSize: "10px" }}>Create New Job</b>
                    </Fab>
                    <br /><br />
                </div>
                <Paper style={{ width: "100%", align: "center" }}>
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
                                {this.state.jobs.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map(column => {
                                                let value = row[column.id];
                                                if (column.id === "deadline" || column.id === "posting_date") value = moment(value).format("dddd, MMMM Do YYYY");
                                                if (column.id === "applicants") {
                                                    return (
                                                        <TableCell style={{ fontSize: "10px" }} onClick={()=>this.viewApplicants(row["id"])} id={row["id"]}>
                                                            <Tooltip title="View Applicants" arrow placement="right"><Button color="primary">{value}</Button></Tooltip>
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
                        count={this.state.jobs.length}
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

export default Jobs;