import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import StudentNavBar from "./studentNavBar"
import _ from "lodash";

class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {},
            student: {},
            majors: [],
            successDialog: false,
            buttonText: "+ RSVP for Event",
            buttonDisabled: false
        }
        this.fetchProfile = this.fetchProfile.bind(this)
        this.applyForEvent = this.applyForEvent.bind(this)
    }

    applyForEvent = () => {
        const { match: { params } } = this.props
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:8080/event/' + params.id + '/register', {
            companyId: this.state.event.company_id,
            studentId: sessionStorage.getItem("id")
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        buttonText: "Registered",
                        buttonDisabled: true
                    })
                }
            })
            .catch((error) => {
            })
    }

    fetchProfile = () => {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile')
            .then(response => {
                if (response.status === 200) {
                    let major = []
                    response.data.education.map(education => {
                        major.push(education.major.toLowerCase())
                    })
                    this.setState({
                        student: response.data,
                        majors: major
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    student: {}
                })
            })
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        let url = 'http://localhost:8080/event/' + params.id + '?studentId=' + sessionStorage.getItem("id");
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        event: response.data
                    })
                    if (response.data.status === "Applied") {
                        this.setState({
                            buttonText: "Already Applied",
                            buttonDisabled: true
                        })
                    }
                }
            })
            .catch((error) => {
                this.setState({
                    event: {}
                })
            })
        this.fetchProfile()
    }

    render() {
        let eventDetails = null;
        if (_.isEmpty(this.state.event)) {
            eventDetails = (
                <b>Fetching Event Details. Please Wait...!</b>
            )
        } else {
            eventDetails = (
                <div className="container" style={{ width: "75%", align: "center", marginTop: "3px" }}>
                    <div className="row" style={{ marginBottom: "3px" }}>
                        <Card style={{ padding: "10px", marginTop: "0px", backgroundColor: "grey", height: "100px", textAlign: "-webkit-center", verticalAlign: "center" }}>
                            <h2 style={{ color: "white" }}>{this.state.event.company_name}</h2>
                        </Card>
                    </div>
                    <div className="row">
                        <Card style={{ padding: "30px", marginBottom: "0px", marginTop: "0px" }}>
                            <div className="row">
                                <div className="col-md-1" style={{ alignItems: "center", verticalAlign: "center", marginTop: "0px" }}>
                                    <Avatar variant="square" style={{ width: "80px", height: "80px" }}>
                                        <b style={{ fontSize: "90" }}>{this.state.event.company_name}</b>
                                    </Avatar>
                                </div>
                                <div className="col-md-8" style={{ marginLeft: "35px" }}>
                                    <Typography variant="h4" style={{ marginBottom: "5px" }}>
                                        <b>{this.state.event.name}</b>
                                    </Typography>
                                    <Typography variant="h5" style={{ marginBottom: "5px" }}>
                                        <b>{this.state.event.company_name.toUpperCase()}</b>
                                    </Typography>
                                    <Typography variant="h5" style={{ marginBottom: "5px" }}>
                                        <span class="glyphicon glyphicon-map-marker"></span> {this.state.event.location}
                                    </Typography>
                                    <Typography variant="h5" style={{ marginBottom: "5px" }}>
                                        <span class="glyphicon glyphicon-time"></span> {moment(this.state.event.date).format("dddd, MMMM Do YYYY")} - {moment(this.state.event.time, "HH:mm:ss").format("LT")}
                                    </Typography>
                                    <Typography variant="h5" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
                                        <b>Eligibility: </b>{this.state.event.eligibility}
                                    </Typography>
                                </div>
                                <div className="col-md-1" style={{ alignItems: "center", verticalAlign: "center", marginTop: "0px" }}>
                                    {(this.state.event.eligibility.toLowerCase() === "all") || (!_.isEmpty(_.intersection(this.state.event.eligibility.toLowerCase().split(","), this.state.majors))) ?
                                        (
                                            <button type="button" class="btn btn-primary"
                                                style={{ backgroundColor: this.state.buttonDisabled ? "green" : "#1569e0" }}
                                                onClick={this.applyForEvent}
                                                disabled={this.state.buttonDisabled}
                                            >
                                                <b>{this.state.buttonText}</b>
                                            </button>
                                        )
                                        : (
                                            <button type="button" class="btn btn-primary"
                                                style={{ backgroundColor: "red" }}
                                                disabled="true"
                                            >
                                                <b>Not Eligible</b>
                                            </button>
                                        )}
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="row" style={{ marginTop: "3px" }}>
                        <Card style={{ padding: "20px", marginTop: "0px", height: "100px" }}>
                            {this.state.event.description}
                        </Card>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <StudentNavBar tab="events" />
                {eventDetails}
            </div>
        )
    }
}

export default EventDetails;