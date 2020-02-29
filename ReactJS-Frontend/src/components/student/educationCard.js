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

class EducationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            student: {},
            education: []
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.student,
            education: nextProps.student.education
        })
    }

    render() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let educationDetails = null;
        if (this.state.education.length > 0) {
            educationDetails = (
                <div class="row">
                    {this.state.education.map((education, index) => {
                        return (
                            <div class="row" style={{ paddingLeft: "30px", marginBottom: "20px" }}>
                                <div class="col-md-2" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                                    <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                        <h6><SchoolIcon style={{ fontSize: 35, color: "#2c347a" }} /></h6>
                                    </Avatar>
                                </div>
                                <div class="col-md-9" style={{ marginLeft: "0px"}}>
                                    <div class="row">
                                        <Typography variant="h4" color="textPrimary">
                                            <h4 style={{ margin: "0px" }}> {this.state.education[index]["college_name"]}</h4>
                                        </Typography>
                                    </div>
                                    <div class="row">
                                        <Typography variant="h6" color="inherit">
                                            {this.state.education[index]["degree"]}
                                        </Typography>
                                    </div>
                                    <div class="row">
                                        <Typography variant="h6" color="inherit">
                                            {months[this.state.education[index]["month_of_starting"]]}&nbsp;
                                            {this.state.education[index]["year_of_starting"]} to&nbsp;
                                            {months[this.state.education[index]["month_of_passing"]]}&nbsp;
                                            {this.state.education[index]["year_of_passing"]}
                                        </Typography>
                                    </div>
                                    <div class="row" >
                                        <b >Major in </b><Typography style={{ display: "inline" }} variant="h6" color="inherit">
                                            {this.state.education[index]["major"]}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            educationDetails = (
                <div class="row" style={{ paddingLeft: "30px", marginBottom: "0px" }}>
                    <div class="col-md-12" style={{ textAlign: "-webkit-center" }}><h5>No Education Details Found</h5></div>
                </div>
            )
        }
        return (
            <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "10px", marginTop: "0px" }}>
                <h4 style={{ marginBottom: "25px", paddingBottom: "0px", marginLeft: "15px" }}>Education</h4>
                <div class="row" style={{ width: "100%" }}>
                    {educationDetails}
                </div>
            </Card>
        )
    }
}


export default EducationCard;