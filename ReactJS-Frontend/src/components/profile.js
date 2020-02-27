import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

class CompanyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: {},
            name: "",
            location: "",
            description: "",
            contact_num: "",
            contact_name: "",
            contact_email: "",
            enableDescriptionSave: false,
            enableContactSave: false,
            enableProfileEdit: false
        }
        this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this)
        this.descriptionClickHandler = this.descriptionClickHandler.bind(this)
        this.descriptionSaveHandler = this.descriptionSaveHandler.bind(this)
        this.contactSaveHandler = this.contactSaveHandler.bind(this)
        this.contactNameChangeHandler = this.contactNameChangeHandler.bind(this)
        this.contactNumberChangeHandler = this.contactNumberChangeHandler.bind(this)
        this.contactEmailChangeHandler = this.contactEmailChangeHandler.bind(this)
        this.enableContactEdit = this.enableContactEdit.bind(this)
        this.fetchCompanyDetails = this.fetchCompanyDetails.bind(this)
        this.enableProfileEdit = this.enableProfileEdit.bind(this)
        this.nameChangeHandler = this.nameChangeHandler.bind(this)
        this.locationChangeHandler = this.locationChangeHandler.bind(this)
        this.profileSaveHandler = this.profileSaveHandler.bind(this)
    }

    componentDidMount() {
        this.fetchCompanyDetails();
    }

    fetchCompanyDetails = () => {
        let url = 'http://localhost:8080/company?id=' + sessionStorage.getItem("id");
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        company: response.data,
                        name: response.data.name,
                        location: response.data.location,
                        description: response.data.description,
                        contact_num: response.data.contact_num,
                        contact_name: response.data.contact_name,
                        contact_email: response.data.contact_email
                    })
                } else {
                    this.setState({
                        company: {}
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    company: {}
                })
            });
    }

    descriptionChangeHandler = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    descriptionClickHandler = (event) => {
        this.setState({
            enableDescriptionSave: true
        })
    }

    descriptionSaveHandler = (event) => {
        let url = 'http://localhost:8080/company/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            description: this.state.description
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableDescriptionSave: false
                    })
                } else {
                    this.setState({
                        enableDescriptionSave: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    enableDescriptionSave: true
                })
            });
    }

    enableContactEdit = (event) => {
        this.setState({
            enableContactSave: true
        })
    }

    contactEmailChangeHandler = (event) => {
        this.setState({
            contact_email: event.target.value
        })
    }

    contactNumberChangeHandler = (event) => {
        this.setState({
            contact_num: event.target.value
        })
    }

    contactNameChangeHandler = (event) => {
        this.setState({
            contact_name: event.target.value
        })
    }

    contactSaveHandler = (event) => {
        let url = 'http://localhost:8080/company/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            contact_name: this.state.contact_name,
            contact_num: this.state.contact_num,
            contact_email: this.state.contact_email
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableContactSave: false
                    })
                } else {
                    this.setState({
                        enableContactSave: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    enableContactSave: true
                })
            });
    }

    enableProfileEdit = () => {
        this.setState({
            enableProfileEdit: true
        })
    }

    nameChangeHandler = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    locationChangeHandler = (event) => {
        this.setState({
            location: event.target.value
        })
    }

    profileSaveHandler = () => {
        let url = 'http://localhost:8080/company/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            name: this.state.name,
            location: this.state.location
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableProfileEdit: false
                    })
                } else {
                    this.setState({
                        enableProfileEdit: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    enableProfileEdit: true
                })
            });
    }

    render() {
        let descriptionSave = null;
        if (this.state.enableDescriptionSave) {
            descriptionSave = (
                <button type="button" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" onClick={this.descriptionSaveHandler}>Save</button>
            )
        } else descriptionSave = null

        let contactSave = null;
        if (this.state.enableContactSave) {
            contactSave = (
                <div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactEmail">Contact Email</label>
                        <input onChange={this.contactEmailChangeHandler} value={this.state.contact_email} type="email" class="form-control" id="contactEmail" aria-describedby="emailHelp" placeholder="Enter Contact Email"></input>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactNumber">Contact Number</label>
                        <input onChange={this.contactNumberChangeHandler} value={this.state.contact_num} type="mobile" class="form-control" id="contactNumber" aria-describedby="emailHelp" placeholder="Enter Contact Number"></input>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactName">Contact Name</label>
                        <input onChange={this.contactNameChangeHandler} value={this.state.contact_name} type="text" readonly class="form-control" id="contactName" aria-describedby="contactName" placeholder="Enter Contact Name"></input>
                    </div>
                    <div class="col-md-12" style={{ textAlign: "-webkit-right", paddingRight: "15px" }}>
                        <button type="button" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" onClick={this.contactSaveHandler}>Save</button>
                    </div>
                </div>
            )
        } else {
            contactSave = (
                <div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><MailOutlineIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.contact_email === "" ? "NA" : this.state.contact_email}
                        </Typography>
                        </div>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><PhoneIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.contact_num === "" ? "NA" : this.state.contact_num}
                        </Typography>
                        </div>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><AssignmentIndIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.contact_name === "" ? "NA" : this.state.contact_name}
                        </Typography>
                        </div>
                    </div>
                </div>
            )
        }

        let profileSave = null;
        if (!this.state.enableProfileEdit) {
            profileSave = (
                <CardContent style={{ textAlign: "-webkit-right" }} >
                    <EditIcon className="editicon" color="primary" onClick={this.enableProfileEdit} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                    <div style={{ textAlign: "-webkit-center" }}>
                        <Avatar variant="circle" style={{ width: "110px", height: "110px", margin: "15px", backgroundColor: "orange" }}>
                            <h3>{this.state.company.name}</h3>
                        </Avatar>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <h3>{this.state.company.name}</h3>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <LocationOnIcon style={{ fontSize: 30, display: "inline", paddingTop: "10px" }} color="primary" /><h4 style={{ display: "inline", paddingBottom: "90px" }}>{this.state.company.location}</h4>
                    </div>
                    <div style={{ textAlign: "-webkit-center", marginTop: "10px" }}>
                        <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span><h5 style={{ display: "inline", paddingBottom: "90px" }}> {this.state.company.email}</h5>
                    </div>
                </CardContent>
            )
        } else {
            profileSave = (
                <CardContent >
                    <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                        <form onSubmit={this.profileSaveHandler}>
                            <div style={{ textAlign: "-webkit-center" }}>
                                <Avatar variant="circle" style={{ width: "110px", height: "110px", margin: "15px", backgroundColor: "grey" }}>
                                    <h5>Change Photo</h5>
                                </Avatar>
                            </div>
                            <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                <label for="name">Name</label>
                                <input required onChange={this.nameChangeHandler} value={this.state.name} type="text" class="form-control" id="name" aria-describedby="name" placeholder=""></input>
                            </div>
                            <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                <label for="location">Location</label>
                                <input required onChange={this.locationChangeHandler} value={this.state.location} type="text" readonly class="form-control" id="location" aria-describedby="location" placeholder=""></input>
                            </div>
                            <div class="col-md-12" style={{ textAlign: "-webkit-right", marginTop: "10px" }}>
                                <button type="submit" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" >Save</button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            )
        }
        return (
            <div style={{ marginTop: "30px" }}>
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">
                            <Card>
                                {profileSave}
                            </Card>
                        </div>
                        <div class="col-md-8">
                            <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                                <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>Description</h4>
                                <div class="row" style={{ width: "100%" }}>
                                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                        <textarea
                                            class="form-control"
                                            id="description"
                                            rows="3"
                                            style={{ marginLeft: "15px" }}
                                            onClick={this.descriptionClickHandler}
                                            onChange={this.descriptionChangeHandler}
                                            value={this.state.description}
                                        >
                                        </textarea>
                                    </div>
                                    <div class="col-md-12" style={{ textAlign: "-webkit-right", paddingRight: "0px" }}>
                                        {descriptionSave}
                                    </div>
                                </div>
                            </Card>
                            <Card style={{ marginBottom: "0px", paddingBottom: "10px", paddingTop: "15px" }}>
                                <div class="row">
                                    <div class="col-md-10">
                                        <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>Contact Info</h4>
                                    </div>
                                    <div class="col-md-2" style={{ textAlign: "-webkit-center" }}>
                                        <EditIcon className="editicon" color="primary" onClick={this.enableContactEdit} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                                    </div>
                                </div>
                                <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                                    {contactSave}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

export default CompanyProfile;