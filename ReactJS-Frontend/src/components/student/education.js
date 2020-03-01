import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import moment from "moment"
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CakeIcon from '@material-ui/icons/Cake';
import HomeIcon from '@material-ui/icons/Home';
import SchoolIcon from '@material-ui/icons/School';
import _ from 'lodash';
import { th } from 'date-fns/locale';

class Education extends Component {
    constructor(props) {
        super(props);
        this.state = {
            college_name: "",
            degree: "",
            major: "",
            year_of_starting: "",
            month_of_starting: "01",
            year_of_passing: "",
            month_of_passing: "10",
            cgpa: "",
            education: {},
            enableEdit: false,
            id: "",
            color: "white"
        }
        this.saveSchoolChanges = this.saveSchoolChanges.bind(this)
        this.enableEdit = this.enableEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteSchool = this.deleteSchool.bind(this)
        this.mouseInListener = this.mouseInListener.bind(this)
        this.mouseOutListener = this.mouseOutListener.bind(this)
    }

    componentDidMount() {
        this.setState({
            college_name: this.props.education.college_name,
            degree: this.props.education.degree,
            major: this.props.education.major,
            year_of_starting: this.props.education.year_of_starting,
            month_of_starting: this.props.education.month_of_starting,
            year_of_passing: this.props.education.year_of_passing,
            month_of_passing: this.props.education.month_of_passing,
            cgpa: this.props.education.cgpa,
            id: this.props.education.id,
            education: this.props.education
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            college_name: nextProps.education.college_name,
            degree: nextProps.education.degree,
            major: nextProps.education.major,
            year_of_starting: nextProps.education.year_of_starting,
            month_of_starting: nextProps.education.month_of_starting,
            year_of_passing: nextProps.education.year_of_passing,
            month_of_passing: nextProps.education.month_of_passing,
            cgpa: nextProps.education.cgpa,
            id: nextProps.education.id,
            education: nextProps.education
        })
    }

    saveSchoolChanges = (event) => {
        event.preventDefault();
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            college_name: this.state.college_name,
            degree: this.state.degree,
            major: this.state.major,
            year_of_starting: this.state.year_of_starting,
            month_of_starting: this.state.month_of_starting,
            year_of_passing: this.state.year_of_passing,
            month_of_passing: this.state.month_of_passing,
            cgpa: this.state.cgpa,
            id: this.state.id
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableEdit: false
                    })
                    this.props.fetchStudentDetails()
                }
            })
            .catch((error) => {
                this.setState({
                    enableEdit: true
                })
            });
    }

    deleteSchool = (event) => {
        event.preventDefault();
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile?entity=education&id=' + this.state.id;
        axios.defaults.withCredentials = true;
        axios.delete(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableEdit: false
                    })
                    this.props.fetchStudentDetails()
                }
            })
            .catch((error) => {
                this.setState({
                    enableEdit: true
                })
            });
    }

    enableEdit = () => {
        this.setState({
            enableEdit: !this.state.enableEdit
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    mouseInListener = () => {
        this.setState({ color: "#3f51b5" })
    }

    mouseOutListener = () => {
        this.setState({ color: "white" })
    }

    render() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let educationDetails = null;
        if (!this.state.enableEdit) {
            educationDetails = (
                <div class="row" key={this.state.id} style={{ paddingLeft: "15px" }} onMouseEnter={this.mouseInListener} onMouseLeave={this.mouseOutListener}>
                    <div class="row" style={{ paddingLeft: "30px", marginBottom: "0px" }}>
                        <div class="col-md-1" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                            <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                <h6><SchoolIcon style={{ fontSize: 35, color: "#2c347a" }} /></h6>
                            </Avatar>
                        </div>
                        <div class="col-md-8" style={{ marginLeft: "30px" }}>
                            <div class="row">
                                <Typography variant="h4" color="textPrimary">
                                    <h4 style={{ margin: "0px" }}> {this.state.college_name}</h4>
                                </Typography>
                            </div>
                            <div class="row">
                                <Typography variant="h6" color="inherit">
                                    {this.state.degree}
                                </Typography>
                            </div>
                            <div class="row">
                                <Typography variant="h6" color="inherit">
                                    {months[this.state.month_of_starting]}&nbsp;
                                            {this.state.year_of_starting} to&nbsp;
                                            {months[this.state.month_of_passing]}&nbsp;
                                            {this.state.year_of_passing}
                                </Typography>
                            </div>
                            <div class="row" >
                                <b>Major in </b><Typography style={{ display: "inline" }} variant="h6" color="inherit">
                                    {this.state.major}
                                </Typography>
                            </div>
                        </div>
                        <div class="col-md-1">
                            <EditIcon className="editicon" color={this.state.color} onClick={this.enableEdit} style={{ textAlign: "-webkit-right", cursor: "pointer", color: this.state.color }} />
                        </div>
                    </div>
                </div>
            )
        } else {
            educationDetails = (
                <div class="row" style={{ paddingLeft: "15px", marginBottom: "20px", marginTop: "0px" }}>
                    <form onSubmit={this.saveSchoolChanges}>
                        <div class="col-md-1" style={{ marginLeft: "30px", paddingRight: "0px", marginRight: "0px" }}>
                            <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                <h6><SchoolIcon style={{ fontSize: 35, color: "#2c347a" }} /></h6>
                            </Avatar>
                        </div>
                        <div class="col-md-9" style={{ marginLeft: "20px" }}>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label for="contactEmail">School Name</label>
                                    <input required onChange={this.handleChange} value={this.state.college_name} type="text" class="form-control" name="college_name" id="college_name"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Education Level</label>
                                    <input required onChange={this.handleChange} value={this.state.degree} type="text" class="form-control" id="degree" name="degree"></input>
                                </div>
                            </div>
                            <div class="row" style={{ paddingRight: "40px" }}>
                                <div class="row" style={{ marginLeft: "15px" }}><label htmlFor="contactEmail">Time Period</label></div>
                                <div class="row" style={{ marginLeft: "0px" }}>
                                    <div className="col-md-6" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                        <label htmlFor="contactEmail">Start Date: </label>
                                        <div class="form-inline" style={{ marginBottom: "10px" }}>
                                            <select required defaultChecked="04" id="inputState" class="form-control" style={{ width: "55%", marginRight: "5px" }} onChange={this.handleChange} name="month_of_starting">
                                                <option selected value={"01"}>January</option>
                                                <option value={"02"}>February</option>
                                                <option value={"03"}>March</option>
                                                <option value={"04"}>April</option>
                                                <option value={"05"}>May</option>
                                                <option value={"06"}>June</option>
                                                <option value={"07"}>July</option>
                                                <option value={"08"}>August</option>
                                                <option value={"09"}>September</option>
                                                <option value={"10"}>October</option>
                                                <option value={"11"}>November</option>
                                                <option value={"12"}>December</option>
                                            </select>
                                            <input required style={{ width: "35%", marginRight: "5px" }} onChange={this.handleChange} value={this.state.year_of_starting} type="number" class="form-control" id="year_of_starting" name="year_of_starting"></input>
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                                        <label htmlFor="contactEmail">End Date: </label>
                                        <div class="form-inline" style={{ marginBottom: "10px" }}>
                                            <select required id="inputState" class="form-control" style={{ width: "55%", marginRight: "5px" }} onChange={this.handleChange} name="month_of_passing">
                                                <option selected value={"01"}>January</option>
                                                <option value={"02"}>February</option>
                                                <option value={"03"}>March</option>
                                                <option value={"04"}>April</option>
                                                <option value={"05"}>May</option>
                                                <option value={"06"}>June</option>
                                                <option value={"07"}>July</option>
                                                <option value={"08"}>August</option>
                                                <option value={"09"}>September</option>
                                                <option value={"10"}>October</option>
                                                <option value={"11"}>November</option>
                                                <option value={"12"}>December</option>
                                            </select>
                                            <input required style={{ width: "35%", marginRight: "5px" }} onChange={this.handleChange} value={this.state.year_of_passing} type="number" class="form-control" id="year_of_passing" name="year_of_passing"></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Major</label>
                                    <input required onChange={this.handleChange} value={this.state.major} type="text" class="form-control" id="major" name="major"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">GPA</label>
                                    <input required onChange={this.handleChange} value={this.state.cgpa} type="number" class="form-control" id="cgpa" name="cgpa"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-2" style={{ textAlign: "-webkit-left", marginTop: "10px", marginRight: "30px" }}>
                                    <button type="button" onClick={this.deleteSchool} style={{ backgroundColor: "#d6242a", color: "white" }} class="btn btn-secondary" >Delete</button>
                                </div>
                                <div class="col-md-8" style={{ textAlign: "-webkit-right", marginTop: "10px", marginRight: "30px" }}>
                                    <button type="button" onClick={this.enableEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black" }} class="btn btn-secondary" >Cancel</button>
                                    <button type="submit" style={{ backgroundColor: "#0d7f02", marginLeft: "5px" }} class="btn btn-success">Save</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
        return (
            <div style={{}}>
                <div style={{ paddingBottom: "10px", paddingTop: "10px", marginTop: "0px", paddingLeft: "5px" }}>
                    <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                        {educationDetails}
                    </div>
                </div>
            </div >
        )
    }
}

export default Education;