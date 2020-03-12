import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CreateJob from "./createJob"
import { Redirect } from 'react-router';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';

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
    }
    updateJobs = () => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/jobs';
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
            <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
                {createDialog}
                {jobApplicants}
                <div>
                    <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} onClick={this.toggleCreate} >
                        <AddIcon /><b style={{ fontSize: "10px" }}>Create New Job</b>
                    </Fab>
                    <br /><br />
                </div>
                <div>
                    {this.state.jobs.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(job => {
                        return (
                            <Card style={{ padding: "15px",marginBottom:"4px" }}>
                                <div className="row">
                                    <div className="col-md-1">
                                        <Avatar variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "#5ba1c7" }} >
                                            <h6><WorkIcon style={{ fontSize: 50, color: "#385b6e" }} /></h6>
                                        </Avatar>
                                    </div>
                                    <div className="col-md-9" style={{ paddingLeft: "55px" }}>
                                        <div className="row inline"><h4 style={{ marginBottom: "6px", paddingBottom: "0px" }}>{job.title}</h4></div>
                                        <div className="row"><h5 style={{ marginTop: "0px", marginBottom: "4px" }}><span class="glyphicon glyphicon-map-marker"></span> {job.location}</h5></div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            <Typography color="" variant="h6" style={{ display: "inline", marginLeft: "0px", marginRight: "25px" }}><span class="glyphicon glyphicon-briefcase"></span> {job.category}</Typography>
                                            <Typography color="" variant="h6" style={{ display: "inline", marginRight: "25px" }}><span class="glyphicon glyphicon-usd"></span> {job.salary} per hour</Typography>
                                            <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span> Posted {moment(job.posting_date).format("MMMM Do")}</Typography>
                                        </div>
                                        <div className="row ">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}>Deadline: {moment(job.deadline).format("MMMM Do")}</Typography>
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-2" style={{ backgroundColor: "" }}>
                                        <Button color="primary" variant="outlined" onClick={() => this.viewApplicants(job["id"])}>{job.applicants}</Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={this.state.jobs.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div>
        )
    }
}

export default Jobs;