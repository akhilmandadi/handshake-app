import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import ProfileCard from './profileCard';
import SkillCard from './skillCard';
import EducationCard from './educationCard';
import ExperienceCard from './experienceCard';
import PersonalInfoCard from './personalInfoCard';
import CircularProgress from '@material-ui/core/CircularProgress';

class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            education: {},
            experience: {},
            objective: "",
            enableObjectiveSave: false,
            img: ""
        }
        this.objectiveChangeHandler = this.objectiveChangeHandler.bind(this)
        this.objectiveClickHandler = this.objectiveClickHandler.bind(this)
        this.objectiveSaveHandler = this.objectiveSaveHandler.bind(this)
        this.fetchStudentDetails = this.fetchStudentDetails.bind(this)
    }

    componentDidMount() {
        this.fetchStudentDetails();
        // this.fetchImageDetails();
    }

    fetchStudentDetails = () => {
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    var base64Flag = 'data:image/jpeg;base64,';
                    if (response.data.image !== null) {
                        var imageStr = this.arrayBufferToBase64(response.data.image.data);
                        response.data.image = base64Flag + imageStr
                    }
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

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

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
        let loadingView = null;
        if (_.isEmpty(this.state.student)) {
            loadingView = (
                <div style={{ zIndex: "1000" }}>
                    <Card style={{ zIndex: "100000", width: "100%", height: "600px", textAlign: "-webkit-center" }}>
                        <div style={{ marginTop: "200px", width: "200px" }}>
                            <CircularProgress />
                        </div>
                    </Card>
                </div>
            )
        }
        return (
            <div style={{ marginTop: "15px" }}>
                {loadingView}
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">
                            <div class="row" >
                                <div class="col-md-12">
                                    <ProfileCard student={this.state.student} fetchStudentDetails={this.fetchStudentDetails} />
                                </div>
                            </div>
                            <div class="row" >
                                <div class="col-md-12">
                                    <SkillCard student={this.state.student} fetchStudentDetails={this.fetchStudentDetails} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <PersonalInfoCard student={this.state.student} fetchStudentDetails={this.fetchStudentDetails} />
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="row" >
                                <div class="col-md-12">
                                    <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                                        <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>My Journey</h4>
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
                                    <EducationCard student={this.state.student} fetchStudentDetails={this.fetchStudentDetails} />
                                </div>
                            </div>
                            <div class="row" >
                                <div class="col-md-12">
                                    <ExperienceCard student={this.state.student} fetchStudentDetails={this.fetchStudentDetails} />
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