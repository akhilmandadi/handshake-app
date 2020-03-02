import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import _ from "lodash";
import moment from "moment"
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import CakeIcon from '@material-ui/icons/Cake';
import HomeIcon from '@material-ui/icons/Home';

class PersonalInfoCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            mobile: "",
            city: "",
            state: "",
            country: "",
            dob: "",
            enableProfileSave: false
        }
        this.profileSaveHandler = this.profileSaveHandler.bind(this)
        this.enableEdit = this.enableEdit.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.student,
            email: nextProps.student.email,
            mobile: nextProps.student.mobile,
            city: nextProps.student.city,
            state: nextProps.student.state,
            country: nextProps.student.country,
            dob: nextProps.student.dob.substr(0,10),
        })
    }

    profileSaveHandler = (event) => {
        event.preventDefault();
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            email: this.state.email,
            mobile: this.state.mobile,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            dob: this.state.dob
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableProfileSave: false
                    })
                    this.props.fetchStudentDetails()
                } else {
                    this.setState({
                        enableProfileSave: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    enableProfileSave: true
                })
            });
    }

    enableEdit = () => {
        this.setState({
            enableProfileSave: !this.state.enableProfileSave
        })
        this.props.fetchStudentDetails()
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        let profileSave = null;
        if (this.state.enableProfileSave) {
            profileSave = (
                <div>
                    <div class="row" style={{ paddingTop: "10px" }}>
                        <div class="col-md-10">
                            <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px", marginTop: "0px" }}>Personal Information</h4>
                        </div>
                    </div>
                    <form onSubmit={this.profileSaveHandler}>
                        <div class="row" style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="email">Email</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.email} required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" type="email" class="form-control" name="email" id="email" placeholder="Email"></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="mobile">Number</label></div>
                                <div class="col-md-8"> <input onChange={this.handleChange} value={this.state.mobile} type="tel" pattern="[0-9]{10}" name="mobile" class="form-control" id="number" placeholder="Mobile"></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="dob">DOB</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.dob} name="dob" type="date" class="form-control" id="dob" placeholder=""></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="city">City</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.city} name="city" type="text" class="form-control" id="city" placeholder="City"></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="state">State</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.state} name="state" type="text" class="form-control" id="state" placeholder="State"></input></div>
                            </div>
                            <div class="row" style={{ marginBottom: "10px", paddingLeft: "15px" }}>
                                <div class="col-md-3"><label for="country">Country</label></div>
                                <div class="col-md-8"><input onChange={this.handleChange} value={this.state.country} name="country" type="text" class="form-control" id="country" placeholder="Country"></input></div>
                            </div>
                        </div >
                        <div className="row" style={{ marginLeft: "0px", marginRight: "0px" }}>
                            <div class="col-md-6" style={{ textAlign: "-webkit-center", marginTop: "10px", paddingRight: "3px" }}>
                                <button type="button" onClick={this.enableEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", width: "100%", color: "black" }} class="btn btn-secondary" >Cancel</button>
                            </div>
                            <div class="col-md-6" style={{ textAlign: "-webkit-center", marginTop: "10px", paddingLeft: "3px" }}>
                                <button type="submit" style={{ backgroundColor: "#0d7f02", width: "100%" }} class="btn btn-success" >Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            )
        } else {
            profileSave = (
                <div>
                    <div class="row" style={{ paddingTop: "10px", paddingRight: "10px" }}>
                        <div class="col-md-9">
                            <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px", marginTop: "0px" }}>Personal Information</h4>
                        </div>
                        <div class="col-md-2" style={{ textAlign: "-webkit-right",paddingLeft:"30px" }}>
                            <EditIcon className="editicon" color="primary" onClick={this.enableEdit} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                        </div>
                    </div>
                    <div class="row" style={{ paddingLeft: "15px" }}>
                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><MailOutlineIcon style={{ fontSize: 25 }} color="primary" /></div>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                &nbsp;&nbsp;{this.state.email}
                            </Typography>
                            </div>
                        </div>
                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><PhoneIcon style={{ fontSize: 25 }} color="primary" /></div>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                &nbsp;&nbsp;{this.state.mobile === ("" || null) ? "-" : this.state.mobile}
                            </Typography>
                            </div>
                        </div>
                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><CakeIcon style={{ fontSize: 25 }} color="primary" /></div>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                &nbsp;&nbsp;{this.state.dob === ("" || null) ? "-" : moment(this.state.dob).format("Do MMMM YYYY")}
                            </Typography>
                            </div>
                        </div>
                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><HomeIcon style={{ fontSize: 25 }} color="primary" /></div>
                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                &nbsp;&nbsp;{this.state.city === ("" || null) ? "-" : this.state.city}
                                {this.state.state === ("" || null) ? "" : "," + this.state.state}
                                {this.state.country === ("" || null) ? "" : "," + this.state.country}
                            </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <Card style={{ marginBottom: "15px", paddingBottom: "10px", paddingTop: "10px", marginTop: "0px", paddingLeft: "5px" }}>
                    <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                        {profileSave}
                    </div>
                </Card>
            </div >
        )
    }
}

export default PersonalInfoCard;