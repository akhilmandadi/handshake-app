import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'
import SchoolIcon from '@material-ui/icons/School';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EditIcon from '@material-ui/icons/Edit';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ProfileCard from './profileCard';

class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            education: {},
            experience: {},
            objective: "",
            enableObjectiveSave: false,
        }
        this.objectiveChangeHandler = this.objectiveChangeHandler.bind(this)
        this.objectiveClickHandler = this.objectiveClickHandler.bind(this)
        this.objectiveSaveHandler = this.objectiveSaveHandler.bind(this)
        this.fetchStudentDetails = this.fetchStudentDetails.bind(this)
    }

    componentDidMount() {
        this.fetchStudentDetails();
    }

    fetchStudentDetails = () => {
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        student: response.data,
                        education: response.data.education,
                        experience: response.data.experience,
                        objective: response.data.career_objective
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

    objectiveChangeHandler = (event) => {
        this.setState({
            objective: event.target.value
        })
    }

    objectiveClickHandler = (event) => {
        this.setState({
            enableObjectiveSave: true
        })
    }

    objectiveSaveHandler = (event) => {
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            objective: this.state.objective
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableObjectiveSave: false
                    })
                } else {
                    this.setState({
                        enableObjectiveSave: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    enableObjectiveSave: true
                })
            });
    }

    render() {
        let objectiveSave = null;
        if (this.state.enableObjectiveSave) {
            objectiveSave = (
                <div>
                    <button type="button" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" onClick={this.objectiveSaveHandler}>Save</button>
                </div>
            )
        } else objectiveSave = null
        return (
            <div style={{ marginTop: "30px" }}>
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">

                            <div class="row" >
                                <div class="col-md-12">
                                    <ProfileCard student={this.state.student} />
                                </div>
                            </div>

                            <div class="row" >
                                <div class="col-md-12">
                                    Skills {/* <SkillsCard /> */}
                                </div>
                            </div>

                        </div>
                        <div class="col-md-8">

                            <div class="row" >
                                <div class="col-md-12">
                                    <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                                        <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>Objective</h4>
                                        <div class="row" style={{ width: "100%" }}>
                                            <div class="col-md-12" style={{ marginBottom: "10px", marginLeft: "15px" }}>
                                                <span style={{ color: "#1569e0" }}>What are you passionate about? What are you looking for on Handshake?
                                                What are your experiences or skills?</span>
                                                <textarea
                                                    class="form-control"
                                                    id="objective"
                                                    rows="3"
                                                    style={{ marginTop: "10px" }}
                                                    onClick={this.objectiveClickHandler}
                                                    onChange={this.objectiveChangeHandler}
                                                    value={this.state.objective}
                                                >
                                                </textarea>
                                            </div>
                                            <div class="col-md-12" style={{ textAlign: "-webkit-right", paddingRight: "0px" }}>
                                                {objectiveSave}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div class="row" >
                                <div class="col-md-12">
                                    Education {/* <Education /> */}
                                </div>
                            </div>

                            <div class="row" >
                                <div class="col-md-12">
                                    Experience {/* <Experience /> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div >
            </div >
        )
    }
}


export default StudentProfile;