import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'
import SchoolIcon from '@material-ui/icons/School';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';

class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: [],
            education: [],
            experience: [],
            page: 0,
            rowsPerPage: 25
        }
    }
    componentDidMount() {
        const { match: { params } } = this.props;
        let url = 'http://localhost:8080/student/' + params.id + '/profile';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    console.log("in axios")
                    console.log(response.data)
                    this.setState({
                        student: response.data,
                        experience: response.data.experience,
                        education: response.data.education
                    })
                } else {
                    this.setState({
                        student: {}
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    student: {}
                })
            });
    }
    render() {
        let name = '\'' + this.state.student.name + '\'';
        let educationDetails = null;
        if (this.state.education.length > 0) {
            educationDetails = (
                <div class="row">
                    {this.state.education.map((education, index) => {
                        return (
                            <div class="row" style={{ paddingLeft: "30px", marginBottom: "20px" }}>
                                <div class="col-md-2" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                                    <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                        <h6><SchoolIcon style={{ fontSize: 35, color:"#2c347a" }} /></h6>
                                    </Avatar>
                                </div>
                                <div class="col-md-9" style={{ marginLeft: "0px" }}>
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
                                            {this.state.education[index]["month_of_starting"]} - {this.state.education[index]["year_of_starting"]} to {this.state.education[index]["month_of_passing"]} - {this.state.education[index]["year_of_passing"]}
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
        let experienceDetails = null;
        if (this.state.experience.length > 0) {
            experienceDetails = (
                <div class="row">
                    {this.state.experience.map((experience, index) => {
                        return (
                            <div class="row" style={{ paddingLeft: "30px", marginBottom: "20px" }}>
                                <div class="col-md-2" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                                    <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                        <h6><LaptopMacIcon style={{ fontSize: 35, color:"#2c347a" }} /></h6>
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
                                            {moment(this.state.experience[index]["start_date"]).format("MMMM YYYY")} to {this.state.experience[index]["end_date"] === null ? "Present" : this.state.experience[index]["end_date"]}
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
            <div style={{ marginTop: "30px" }}>
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">
                            <Card>
                                <CardContent style={{ textAlign: "-webkit-right" }} >
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        <Avatar variant="circle" style={{ width: "110px", height: "110px", margin: "15px", backgroundColor: "#8e6801" }}>
                                            <h1>{name.substring(1, 2)}R</h1>
                                        </Avatar>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        <h3>{this.state.student.name}</h3>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center", marginBottom: "5px" }}>
                                        <h5 style={{ display: "inline" }}>
                                            {this.state.student.college}
                                        </h5>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        <Typography variant="h6">
                                            {(this.state.education.length) > 0 ?
                                                this.state.education[this.state.education.length - 1]["degree"] + ", " + this.state.education[this.state.education.length - 1]["major"]
                                                : "-"}
                                        </Typography>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center", marginTop: "10px" }}>
                                        <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span><h5 style={{ display: "inline", paddingBottom: "90px" }}> {this.state.student.email}</h5>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div class="col-md-8">
                            <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                                <h4 style={{ marginBottom: "25px", paddingBottom: "0px", marginLeft: "15px" }}>Education</h4>
                                <div class="row" style={{ width: "100%" }}>
                                    {educationDetails}
                                </div>
                            </Card>
                            <Card style={{ marginBottom: "0px", paddingBottom: "10px", paddingTop: "15px" }}>
                                <h4 style={{ marginBottom: "25px", paddingBottom: "0px", marginLeft: "15px" }}>Work & Volunteer Experience</h4>
                                <div class="row" style={{ width: "100%" }}>
                                    {experienceDetails}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

export default StudentProfile;