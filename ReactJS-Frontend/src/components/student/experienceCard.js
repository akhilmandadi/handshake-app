import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography'
import SchoolIcon from '@material-ui/icons/School';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';

class ExperienceCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            student: {},
            experience: []
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.student,
            experience: nextProps.student.experience
        })
    }

    render() {
        let experienceDetails = null;
        if (this.state.experience.length > 0) {
            experienceDetails = (
                <div class="row">
                    {this.state.experience.map((experience, index) => {
                        return (
                            <div class="row" style={{ paddingLeft: "30px", marginBottom: "20px" }}>
                                <div class="col-md-2" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                                    <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                        <h6><LaptopMacIcon style={{ fontSize: 35, color: "#2c347a" }} /></h6>
                                    </Avatar>
                                </div>
                                <div class="col-md-9" style={{ marginLeft: "0px" }}>
                                    <div class="row">
                                        <Typography variant="h4" color="textPrimary">
                                            <h4 style={{ margin: "0px" }}> {this.state.experience[index]["company"]}</h4>
                                        </Typography>
                                    </div>
                                    <div class="row">
                                        <Typography variant="h6" color="inherit">
                                            {this.state.experience[index]["title"]}
                                        </Typography>
                                    </div>
                                    <div class="row">
                                        <Typography variant="h6" color="inherit">
                                            {moment(this.state.experience[index]["start_date"]).format("MMMM YYYY")} to {this.state.experience[index]["end_date"] === null ? "Present" : moment(this.state.experience[index]["end_date"]).format("MMMM YYYY")}
                                        </Typography>
                                    </div>
                                    <div class="row">
                                        <Typography variant="h6" color="inherit">
                                            {this.state.experience[index]["description"]}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            experienceDetails = (
                <div class="row" style={{ paddingLeft: "30px", marginBottom: "0px" }}>
                    <div class="col-md-12" style={{ textAlign: "-webkit-center" }}><h5>No Experience Details Found</h5></div>
                </div>
            )
        }
        return (
            <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "10px", marginTop: "0px" }}>
                <h4 style={{ marginBottom: "25px", paddingBottom: "0px", marginLeft: "15px" }}>Experience</h4>
                <div class="row" style={{ width: "100%" }}>
                    {experienceDetails}
                </div>
            </Card>
        )
    }
}


export default ExperienceCard;