import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import StudentNavBar from "./studentNavBar"

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            jobsFilter: [],
            currentJob: {},
            Applied: false,
            Pending: false,
            Reviewed: false,
            Declined: false
        }
        this.searchApplications = this.searchApplications.bind(this)
        this.filterApplicationSearch = this.filterApplicationSearch.bind(this)
        this.searchApplicationsByStatus = this.searchApplicationsByStatus.bind(this)
        this.filterApplicationSearchByStatus = this.filterApplicationSearchByStatus.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)
        this.renderJob = this.renderJob.bind(this)
    }
    componentDidMount() {
        let url = 'http://localhost:8080/jobs';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        jobs: response.data,
                        jobsFilter: response.data,
                        currentJob: response.data[0]
                    })
                } else {
                    this.setState({
                        jobs: [],
                        jobsFilter: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    jobs: [],
                    jobsFilter: []
                })
            });
    }

    searchApplications = (event) => {
        this.setState({
            applications: this.filterApplicationSearch(this.state.applicationsFilter, event.target.value)
        })
    }

    filterApplicationSearch = (applications, searchStr) => {
        searchStr = searchStr.toLowerCase();
        return applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (student[attribute]) return student[attribute].toLowerCase().indexOf(searchStr) !== -1;
            });
        });
    }

    searchApplicationsByStatus = async () => {
        let newData = await this.filterApplicationSearchByStatus(this.state.applicationsFilter)
        this.setState({
            applications: newData
        })
    }

    filterApplicationSearchByStatus = async (applications) => {
        if (this.state.Applied === false && this.state.Pending === false && this.state.Reviewed === false && this.state.Declined === false) {
            return applications
        }
        const isApplied = this.state.Applied;
        const isPending = this.state.Pending;
        const isReviewed = this.state.Reviewed;
        const isDeclined = this.state.Declined;
        const appliedApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isApplied === true) return student[attribute].toLowerCase().indexOf("applied") !== -1;
            });
        });
        const pendingApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isPending === true) return student[attribute].toLowerCase().indexOf("pending") !== -1;
            });
        });
        const reviewApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isReviewed === true) return student[attribute].toLowerCase().indexOf("reviewed") !== -1;
            });
        });
        const declinedApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isDeclined === true) return student[attribute].toLowerCase().indexOf("declined") !== -1;
            });
        });
        return [...appliedApps, ...pendingApps, ...declinedApps, ...reviewApps]
    }

    handleFilterChange = (value) => {
        if (value === 'Applied') this.setState({ Applied: !this.state.Applied, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Pending') this.setState({ Pending: !this.state.Pending, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Reviewed') this.setState({ Reviewed: !this.state.Reviewed, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Declined') this.setState({ Declined: !this.state.Declined, }, () => { this.searchApplicationsByStatus() })
    }

    renderJob = (index) => {
        this.setState({
            currentJob: this.state.jobs[index]
        })
    }

    render() {
        let errorBanner = null;
        if (this.state.jobs.length === 0) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No Jobs Found</b>
                    </CardContent >
                </Card >
            )
        }
        return (
            <div><StudentNavBar tab="jobs" />
                <div className="container" style={{ width: "100%", height: "100%" }}><br />
                    <Grid container spacing={3}>
                        <div style={{ alignContent: "center", width: "100%", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>
                            <Card style={{ height: "100%" }}>
                                <div class="container" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" class="form-control" id="search" aria-describedby="search" placeholder="Job titles, employers or keywords" />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" class="form-control" id="search" aria-describedby="search" placeholder="City, State, Zip Code, or Address" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-1">
                                            <button type="button" class="trial btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
                                                Full-Time
                                            </button>
                                        </div>
                                        <div class="col-md-1">
                                            <button type="button" class="trial btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
                                                Part-Time
                                            </button>
                                        </div>
                                        <div class="col-md-1">
                                            <button type="button" class="trial btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
                                                Internship
                                            </button>
                                        </div>
                                        <div class="col-md-1">
                                            <button type="button" class="trial btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
                                                On-Campus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card >
                        </div>

                        <div style={{ width: "35%", height: "330px", marginLeft: "20px", marginRight: "10px", overflowY: "scroll" }}>
                            <Card style={{ padding: "10px", marginBottom: "0px", zIndex: "1000", width: "100%" }}>
                                <CardContent style={{ paddingBottom: "5px" }}>
                                    <Typography >
                                        <b>Found {this.state.jobs.length} Jobs According to your Preferences</b>
                                    </Typography>
                                </CardContent>
                            </Card>
                            {this.state.jobs.map((job, index) => {
                                return (
                                    <div style={{ alignContent: "right", padding: "0px", borderRadius: "0px", border: "0px" }} onClick={() => this.renderJob(index)} key={job.id} id={job.id}>
                                        <Card className="jobTile" style={{ padding: "10px", marginBottom: "0px" }}>
                                            <div style={{ width: "20%", float: "left", height: "100%", alignItems: "center", overflow: "hidden" }}>
                                                <Avatar variant="square" style={{ width: "50px", height: "50px", margin: "10px", backgroundColor: "orange" }}>
                                                    <b style={{ fontSize: "90" }}>{job.company_name}</b>
                                                </Avatar>
                                            </div>
                                            <div style={{ width: "65%", height: "100%", overflowX: "float", marginLeft: "55px" }}>
                                                <CardContent style={{ paddingBottom: "5px" }}>
                                                    <Typography gutterBottom>
                                                        <b>{job.title.toUpperCase()}</b>
                                                    </Typography>
                                                    <Typography >
                                                        {job.company_name} - {job.location}
                                                    </Typography>
                                                    <Typography style={{ verticalAlign: "center" }}>
                                                        {job.category}
                                                    </Typography>
                                                </CardContent></div>
                                        </Card>
                                    </div>
                                );
                            })}
                            <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                        </div>
                        <div style={{ alignContent: "center", width: "60%", marginRight: "20px", overflowX: "none" }}>
                            <Card style={{ height: "100%", overflowY: "scroll" }}>
                                <div class="container">
                                    <div class="row" style={{ paddingLeft: "20px" }}>
                                        <div class="col-md-8"><h2>{this.state.currentJob.title}</h2></div>
                                    </div>
                                    <div class="row" style={{ paddingLeft: "20px" }}>
                                        <div class="col-md-9">{this.state.currentJob.title}</div>
                                    </div><br />
                                    <div class="row" style={{ paddingLeft: "20px" }}>
                                        <div class="col-md-2"><span class="glyphicon glyphicon-briefcase"></span> {this.state.currentJob.category}</div>
                                        <div class="col-md-1"><span class="glyphicon glyphicon-map-marker"></span> {this.state.currentJob.location}</div>
                                        <div class="col-md-2">$ {this.state.currentJob.salary} per hour</div>
                                        <div class="col-md-2"><span class="glyphicon glyphicon-time"></span> Posted {moment(this.state.currentJob.posting_date).format("MMMM Do")}</div>
                                    </div><br/>
                                    <div class="row" style={{ paddingLeft: "20px"}}>
                                    <div class="col-md-7" style={{border:"1px solid"}}>Applications close on {moment(this.state.currentJob.dealine).format("MMMM Do, YYYY")}</div>
                                    </div><br/>
                                    <div class="row" style={{ paddingLeft: "20px" }}>
                                        <div class="col-md-8">{this.state.currentJob.description}</div>
                                    </div>
                                </div>
                            </Card >
                        </div>
                    </Grid>
                </div ></div >
        )
    }
}

export default Jobs;