import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import StudentNavBar from "./studentNavBar"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
const uuid = require('shortid');

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            jobsFilter: [],
            currentJob: {},
            isApplyDialogOpen: false,
            title: "",
            location: "",
            file: null,
            category: [],
            buttonColor: ["unclickedFilter", "unclickedFilter", "unclickedFilter", "unclickedFilter"]
        }
        this.renderJob = this.renderJob.bind(this)
        this.handleApplyClose = this.handleApplyClose.bind(this)
        this.enableApplyModal = this.enableApplyModal.bind(this)
        this.filterJobs = this.filterJobs.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
        this.changeButtonColor = this.changeButtonColor.bind(this)
        this.applyForJob = this.applyForJob.bind(this)
        this.onChange = this.onChange.bind(this);
        this.getAllJobs = this.getAllJobs.bind(this)
    }
    componentDidMount() {
        this.getAllJobs();
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    getAllJobs = () => {
        let url = 'http://localhost:8080/jobs?studentId=' + sessionStorage.getItem("id");
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    response.data.map(job => {
                        if (job.image !== null) {
                            var imageStr = this.arrayBufferToBase64(job.image.data);
                            job.image = 'data:image/jpeg;base64,' + imageStr
                        }
                    })
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
    renderJob = (index) => {
        this.setState({
            currentJob: this.state.jobs[index]
        })
    }

    handleApplyClose = () => {
        this.setState({
            isApplyDialogOpen: false
        })
    }

    enableApplyModal = () => {
        this.setState({
            isApplyDialogOpen: !this.state.isApplyDialogOpen
        })
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    applyForJob = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('resume', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        let url = 'http://localhost:8080/company/' + this.state.currentJob.company_id +
            '/job/' + this.state.currentJob.id + '/student/' + sessionStorage.getItem("id") + '/apply?id=' + uuid.generate()
        axios.post(url, formData, config)
            .then((response) => {
                this.getAllJobs()
                this.setState({
                    isApplyDialogOpen: false
                })
            }).catch((error) => {
                this.setState({
                    isApplyDialogOpen: true
                })
            });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value },
            () => {
                this.filterJobs()
            });
    }

    changeButtonColor = (index) => {
        let btnColors = this.state.buttonColor
        if (btnColors[index] === "unclickedFilter") btnColors[index] = "clickedFilter"
        else btnColors[index] = "unclickedFilter"
        this.setState({
            buttonColor: btnColors
        })
    }

    handleCategoryChange = (category, colorIndex) => {
        let categoryFilter = this.state.category;
        let index = categoryFilter.indexOf(category)
        if (index === -1) categoryFilter.push(category)
        else categoryFilter.splice(index, 1)
        this.setState({
            category: categoryFilter
        }, () => {
            this.filterJobs()
            this.changeButtonColor(colorIndex)
        })
    }

    filterCategory = (category) => {
        if (_.isEmpty(this.state.category)) return true
        return this.state.category.indexOf(category) > -1
    }

    filterJobs = () => {
        let newJobs = []
        this.state.jobsFilter.map((job, index) => {
            if (job.title.toLowerCase().includes(this.state.title.toLowerCase()) &&
                job.location.toLowerCase().includes(this.state.location.toLowerCase()) &&
                this.filterCategory(job.category)
            ) {
                newJobs.push(job)
            }
        })
        this.setState({
            jobs: newJobs,
            currentJob: newJobs[0]
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
        let applyModal = null;
        if (!_.isEmpty(this.state.currentJob)) {
            applyModal = (
                <Dialog style={{ minWidth: "400px" }} open={this.state.isApplyDialogOpen} onClose={this.handleApplyClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title"><h4>Apply to {this.state.currentJob.company_name}</h4></DialogTitle>
                    <form onSubmit={this.applyForJob}>
                        <DialogContent>
                            <h4>Details from {this.state.currentJob.company_name}:</h4>
                            Applying for {this.state.currentJob.title} Program requires a few documents. Attach them below
                            and get one step closer to your next job!
                        <br /><br /><h5>1. Attach your Resume</h5>
                            <form>
                                <div class="form-group">
                                    <input type="file" class="form-control-file"
                                        name="resume" id="exampleFormControlFile1" onChange={this.onChange} />
                                </div>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.enableApplyModal} color="secondary">
                                Cancel
                        </Button>
                            <button type="submit" class="btn btn-success">Submit Application</button>
                        </DialogActions>
                    </form>
                </Dialog>
            )
        } else {
            applyModal = (<b></b>)
        }

        let currentJob = null;
        if (!_.isEmpty(this.state.currentJob)) {
            currentJob = (
                <div class="container">
                    <div class="row" style={{ paddingLeft: "20px" }}>
                        <div class="col-md-8"><h2>{this.state.currentJob.title}</h2></div>
                    </div>
                    <div class="row" style={{ paddingLeft: "20px" }}>
                        <div class="col-md-9"><Link to={'/company/' + this.state.currentJob.company_id + '/profile'} style={{ color: "black" }}><h4 style={{ marginTop: "0px" }}>{this.state.currentJob.company_name}</h4></Link></div>
                    </div>
                    <div class="row" style={{ paddingLeft: "20px" }}>
                        <Typography color="textSecondary" variant="h6" style={{ display: "inline", marginLeft: "15px", marginRight: "25px" }}><span class="glyphicon glyphicon-briefcase"></span> {this.state.currentJob.category}</Typography>
                        <Typography color="textSecondary" variant="h6" style={{ display: "inline", marginRight: "25px" }}><span class="glyphicon glyphicon-map-marker"></span> {this.state.currentJob.location}</Typography>
                        <Typography color="textSecondary" variant="h6" style={{ display: "inline", marginRight: "25px" }}><span class="glyphicon glyphicon-usd"></span> {this.state.currentJob.salary} per hour</Typography>
                        <Typography color="textSecondary" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span> Posted {moment(this.state.currentJob.posting_date).format("MMMM Do")}</Typography>
                    </div><br />
                    <div class="row" style={{ paddingLeft: "35px" }}>
                        <div class="col-md-7" style={{ border: "1px solid", padding: "10px", borderStyle: "groove", borderRadius: "0px" }}>
                            {this.state.currentJob.applied === "" ? (
                                <div>
                                    <div class="col-md-10" style={{ paddingTop: "5px" }}>Applications close on {moment(this.state.currentJob.deadline).format("MMMM Do, YYYY")}</div>
                                    <div class="col-md-2" ><button type="button" class="btn btn-success" onClick={this.enableApplyModal}>Apply</button></div>
                                </div>
                            ) : (
                                    <div>
                                        <div class="col-md-9" style={{ paddingTop: "5px" }}>Applications close on {moment(this.state.currentJob.deadline).format("MMMM Do, YYYY")}</div>
                                        <div class="col-md-3" ><button type="button" disabled class="btn btn-danger">Applied Already</button></div>
                                    </div>
                                )}
                        </div>
                    </div><br />
                    <div class="row" style={{ paddingLeft: "20px", paddingRight: "40px" }}>
                        <div class="col-md-8" style={{ paddingRight: "20px" }}>{this.state.currentJob.description}</div>
                    </div>
                </div>
            )
        } else {
            currentJob = (
                <b></b>
            )
        }
        return (
            <div>
                <StudentNavBar tab="jobs" />
                {applyModal}
                <div className="container" style={{ width: "100%", height: "100%" }}><br />
                    <Grid container spacing={3}>
                        <div style={{ alignContent: "center", width: "100%", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>
                            <Card style={{ height: "100%" }}>
                                <div class="container" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" name="title" onChange={this.handleChange} class="form-control" id="search" aria-describedby="search" placeholder="Job titles, employers or keywords" />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <input type="text" name="location" onChange={this.handleChange} class="form-control" id="search" aria-describedby="search" placeholder="City, State, Zip Code, or Address" />
                                            </div>

                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <Button variant="contained" className={this.state.buttonColor[0]} onClick={() => this.handleCategoryChange("Full-Time", 0)}>Full-Time</Button>
                                            <Button variant="contained" className={this.state.buttonColor[1]} onClick={() => this.handleCategoryChange("Part-Time", 1)}>Part-Time</Button>
                                            <Button variant="contained" className={this.state.buttonColor[2]} onClick={() => this.handleCategoryChange("Internship", 2)}>Internship</Button>
                                            <Button variant="contained" className={this.state.buttonColor[3]} onClick={() => this.handleCategoryChange("On-Campus", 3)}>On-Campus</Button>
                                        </div>
                                    </div>
                                </div>
                            </Card >
                        </div>

                        <div style={{ width: "35%", height: "330px", marginLeft: "20px", marginRight: "10px", overflowY: "scroll" }}>
                            <Card style={{ padding: "10px", marginBottom: "0px", zIndex: "1000", width: "100%" }}>
                                <CardContent style={{ paddingBottom: "5px" }}>
                                    <Typography >
                                        <Typography color="textSecondary" variant="h6">Found {this.state.jobs.length} Jobs According to your Preferences</Typography>
                                    </Typography>
                                </CardContent>
                            </Card>
                            {this.state.jobs.map((job, index) => {
                                return (
                                    <div style={{ alignContent: "right", padding: "0px", borderRadius: "0px", border: "0px" }} onClick={() => this.renderJob(index)} key={job.id} id={job.id}>
                                        <Card className="jobTile" style={{ padding: "10px", marginBottom: "0px" }}>
                                            <div className="row">
                                                <div className="col-md-2" style={{  }}>
                                                    {job.image === null ? (
                                                        <Avatar variant="square" style={{ width: "50px", height: "50px", margin: "10px", backgroundColor: "orange" }}>
                                                            <b style={{ fontSize: "90" }}>{job.company_name}</b>
                                                        </Avatar>
                                                    ) : (
                                                            <Avatar src={job.image} variant="square" style={{ width: "50px", height: "50px", margin: "10px", backgroundColor: "orange" }} />
                                                        )}
                                                </div>
                                                <div className="col-md-6" style={{ marginLeft: "0px" }}>
                                                    <CardContent className="jobTileText" style={{ paddingBottom: "5px",paddingLeft:"5px",paddingTop:"10px",marginTop:"0px" }}>
                                                        <Typography gutterBottom variant="h5" style={{marginBottom:"2px"}}>
                                                            <b>{job.title}</b>
                                                        </Typography>
                                                        <Typography variant="h6">
                                                            {job.company_name} - {job.location}
                                                        </Typography>
                                                        <Typography variant="h6" style={{ verticalAlign: "center" }}>
                                                            {job.category}
                                                        </Typography>
                                                    </CardContent>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                            <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                        </div>
                        <div style={{ alignContent: "center", height: "330px", width: "59%", marginRight: "20px", overflowX: "none", overflowY: "none" }}>
                            <Card style={{ height: "100%", overflowY: "scroll" }}>
                                {currentJob}
                            </Card >
                        </div>
                    </Grid>
                </div ></div >
        )
    }
}

export default Jobs;