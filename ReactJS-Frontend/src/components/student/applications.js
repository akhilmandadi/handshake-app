import React, { Component } from 'react';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@material-ui/icons/Check';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import StudentNavBar from "./studentNavBar";
import _ from "lodash";

class StudentApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            page: 0,
            rowsPerPage: 25,
            applicationsFilter: [],
            applicationsSearchItems: [],
            applicationsFilterItems: [],
            Applied: false,
            Pending: false,
            Reviewed: false,
            Declined: false
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.searchApplications = this.searchApplications.bind(this)
        this.filterApplicationSearch = this.filterApplicationSearch.bind(this)
        this.searchApplicationsByStatus = this.searchApplicationsByStatus.bind(this)
        this.filterApplicationSearchByStatus = this.filterApplicationSearchByStatus.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)
        this.mergeFilters = this.mergeFilters.bind(this)
    }
    componentDidMount() {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + "/applications";
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    response.data.map(application => {
                        if (application.image !== null) {
                            var imageStr = this.arrayBufferToBase64(application.image.data);
                            application.image = 'data:image/jpeg;base64,' + imageStr
                        }
                    })
                    this.setState({
                        applications: response.data,
                        applicationsFilter: response.data
                    })
                } else {
                    this.setState({
                        applications: [],
                        applicationsFilter: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    applications: [],
                    applicationsFilter: []
                })
            });
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

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

    mergeFilters = () => {
        this.setState({
            applications: _.intersectionBy(this.state.applicationsSearchItems,
                this.state.applicationsFilterItems,
                'id')
        })
    }
    searchApplications = (event) => {
        this.setState({
            applicationsSearchItems: this.filterApplicationSearch(this.state.applicationsFilter, event.target.value)
        }, () => {
            if (!_.isEmpty(this.state.applicationsFilterItems)) this.mergeFilters()
            else this.setState({ applications: this.state.applicationsSearchItems })
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
            applicationsFilterItems: newData
        }, () => {
            if (_.isEmpty(this.state.applicationsSearchItems)) this.setState({ applications: newData })
            else this.mergeFilters()
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

    render() {
        let errorBanner = null;
        if (this.state.applications.length === 0) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No Applications Found</b>
                    </CardContent >
                </Card >
            )
        }
        return (
            <div><StudentNavBar tab="jobs" /><br />
                <div className="container" style={{ width: "90%", height: "100%" }}>
                    <Grid container spacing={3}>
                        <div style={{ alignContent: "center", width: "20%", marginRight: "20px", paddingBottom: "10px" }}>
                            <Card style={{ height: "10%", marginBottom: "1px" }}>
                                <h4 style={{ paddingLeft: "20px" }}>Filters</h4>
                            </Card>
                            <Card style={{ height: "25%", marginBottom: "1px" }}>
                                <CardContent>
                                    <b>Search Applications</b><br />
                                    <input type="text" class="form-control" id="search" aria-describedby="search"
                                        placeholder="Enter a Keyword" onChange={this.searchApplications} style={{ width: "100%", marginTop: "5px" }}
                                    />
                                    <br />
                                </CardContent>
                            </Card>
                            <Card style={{ height: "53%", marginBottom: "1px" }}><CardContent>
                                <div style={{ marginTop: "5px" }}><b>Application Status</b></div>
                                <FormControl component="fieldset" >
                                    <FormGroup >
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Applied} onChange={() => this.handleFilterChange("Applied")} value="Applied" />}
                                            label="Applied"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Pending} onChange={() => this.handleFilterChange("Pending")} value="Pending" />}
                                            label="Pending"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Reviewed} onChange={() => this.handleFilterChange("Reviewed")} value="Reviewed" color="primary" />}
                                            label="Reviewed"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Declined} onChange={() => this.handleFilterChange("Declined")} value="Declined" color="primary" />}
                                            label="Declined"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </CardContent>
                            </Card >
                        </div>
                        <div style={{ width: "75%" }}>
                            <div style={{ marginBottom: "20px", marginTop: "10px" }}><Typography color="textSecondary" variant="h6">
                                {(this.state.page * this.state.rowsPerPage) + 1} - {this.state.applications.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).length} of {this.state.applications.length} applications
                                </Typography></div>
                            {this.state.applications.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(application => {
                                return (
                                    <span style={{ alignContent: "right", padding: "0px" }} key={application.id}>
                                        <Card style={{ padding: "0px", marginBottom: "7px" }}>
                                            <div style={{ width: "15%", float: "left", height: "100%", alignItems: "center", overflow: "hidden" }}>
                                                {application.image === null ? (
                                                    <Avatar variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "orange" }}>
                                                        <b style={{ fontSize: "90" }}>{application.name}</b>
                                                    </Avatar>
                                                ) : (
                                                        <Avatar src={application.image} variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "orange" }} />
                                                    )}
                                            </div>
                                            <div style={{ width: "85%", height: "100%", overflowX: "float" }}>
                                                <CardContent style={{ paddingBottom: "5px" }}>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        <b>{application.title.toUpperCase()}</b>
                                                    </Typography>
                                                    <Typography color="textSecondary">
                                                        {application.name}
                                                    </Typography>
                                                    <Typography color="textSecondary" style={{ verticalAlign: "center" }}>
                                                        <InfoIcon /> Status: {application.status}
                                                    </Typography>
                                                    <Typography color="textSecondary">
                                                        <CheckIcon />Applied {moment(application.applied_on).format("MMMM Do")} - Applications close {moment(application.deadline).format("MMMM Do")}
                                                    </Typography>
                                                </CardContent></div>
                                        </Card>
                                    </span>
                                );
                            })}
                            <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                            <TablePagination
                                rowsPerPageOptions={[25, 50]}
                                component="div"
                                count={this.state.applications.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </div>
                    </Grid>
                </div ></div>
        )
    }
}

export default StudentApplications;