import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import StudentNavBar from "./studentNavBar"

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            eventsFilter: []
        }
        this.searchEvents = this.searchEvents.bind(this)
        this.filterEventSearch = this.filterEventSearch.bind(this)
    }
    componentDidMount() {
        let url = 'http://localhost:8080/events';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                response.data.map(event => {
                    if (event.image !== null) {
                        var imageStr = this.arrayBufferToBase64(event.image.data);
                        event.image = 'data:image/jpeg;base64,' + imageStr
                    }
                })
                if (response.status === 200) {
                    this.setState({
                        events: response.data,
                        eventsFilter: response.data
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    events: [],
                    eventsFilter: []
                })
            });
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    searchEvents = (event) => {
        this.setState({
            events: this.filterEventSearch(this.state.eventsFilter, event.target.value)
        })
    }

    filterEventSearch = (events, searchStr) => {
        searchStr = searchStr.toLowerCase();
        return events.filter(function (event) {
            return Object.keys(event).some(function (attribute) {
                console.log(attribute)
                console.log(event[attribute])
                if (event[attribute] !== "" && attribute === "name") return event[attribute].toLowerCase().indexOf(searchStr) !== -1;
            });
        });
    }

    render() {
        let errorBanner = null;
        if (this.state.events.length === 0) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No Events Found with the search criteria</b>
                    </CardContent >
                </Card >
            )
        }
        return (
            <div>
                <StudentNavBar tab="events" />
                <div className="container" style={{ width: "85%", align: "center", marginTop: "0px" }}>
                    <div className="row">
                        <div class="container" style={{ paddingTop: "10px", paddingBottom: "0px", marginBottom: "0px" }}>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="search" aria-describedby="search"
                                            placeholder="Search By Event Name" onChange={this.searchEvents} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.events.map((event, index) => {
                        return (
                            <Card style={{ padding: "10px", marginBottom: "5px", marginTop: "0px" }}>
                                <div className="row">
                                    <div className="col-md-1" style={{ alignItems: "center", verticalAlign: "center", marginTop: "0px" }}>
                                        
                                        {event.image === null ? (
                                            <Avatar variant="square" style={{ width: "80px", height: "80px" }}>
                                                <b style={{ fontSize: "90" }}>{event.company_name}</b>
                                            </Avatar>
                                        ) : (
                                                <Avatar src={event.image} variant="square" style={{ width: "80px", height: "80px" }} />
                                            )}
                                    </div>
                                    <div className="col-md-8" style={{ marginLeft: "15px" }}>
                                        <Typography variant="h5">
                                            <Link to={"event/" + event.id} style={{ color: "black" }}>
                                                <b>{event.name}</b>
                                            </Link>
                                        </Typography>
                                        <Typography variant="h6" style={{ marginBottom: "0px", paddingBottom: "0px" }}>
                                            <b>{event.company_name.toUpperCase()}</b>
                                        </Typography>
                                        <Typography >
                                            <span class="glyphicon glyphicon-map-marker"></span> {event.location}
                                        </Typography>
                                        <Typography variant="subtitle">
                                            {moment(event.date).format("dddd, MMMM Do YYYY")} - {moment(event.time, "HH:mm:ss").format("LT")}
                                        </Typography><br />
                                        <Typography variant="subtitle" style={{ fontWeight: "600" }}>
                                            <Link to={"event/" + event.id}>
                                                View Details
                                            </Link>
                                        </Typography>
                                    </div>
                                    <div className="col-md-1" style={{ alignItems: "center", verticalAlign: "center", marginTop: "0px" }}>
                                        <Link to={"event/" + event.id}><button type="button" class="btn"
                                            style={{
                                                backgroundColor: "white",
                                                border: "1px solid green",
                                                color: "green",
                                                paddingTop: "2px",
                                                paddingBottom: "2px"
                                            }}>
                                            View Event
                                            </button></Link>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                    <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                </div>
            </div>
        )
    }
}

export default Events;