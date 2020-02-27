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

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            enableProfileSave: false,
        }
        this.profileSaveHandler = this.profileSaveHandler.bind(this)
        this.enableProfileEdit = this.enableProfileEdit.bind(this)
        this.nameChangeHandler = this.nameChangeHandler.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.student.name
        })
    }

    profileSaveHandler = (event) => {
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            name: this.state.name
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

    enableProfileEdit = () => {
        this.setState({
            enableProfileSave: true
        })
    }

    nameChangeHandler = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    render() {
        let profileInfo = null;
        if (!this.state.enableProfileSave) {
            profileInfo = (
                <CardContent style={{ textAlign: "-webkit-right" }} >
                    <EditIcon className="editicon" color="primary" onClick={this.enableProfileEdit} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                    <div style={{ textAlign: "-webkit-center" }}>
                        <Avatar variant="circle" style={{ width: "110px", height: "110px", margin: "15px", backgroundColor: "orange" }}>
                            <h3>{this.props.student.name}</h3>
                        </Avatar>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <h3>{this.props.student.name}</h3>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <LocationOnIcon style={{ fontSize: 30, display: "inline", paddingTop: "10px" }} color="primary" /><h4 style={{ display: "inline", paddingBottom: "90px" }}>{this.props.student.college}</h4>
                    </div>
                    <div style={{ textAlign: "-webkit-center", marginTop: "10px" }}>
                        <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span><h5 style={{ display: "inline", paddingBottom: "90px" }}> {this.props.student.email}</h5>
                    </div>
                </CardContent>
            )
        } else {
            profileInfo = (
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
                            <div class="col-md-12" style={{ textAlign: "-webkit-right", marginTop: "10px" }}>
                                <button type="submit" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" >Save</button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            )
        }
        return (
            <div style={{}}>
                <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                    {profileInfo}
                </Card>
            </div >
        )
    }
}


export default ProfileCard;