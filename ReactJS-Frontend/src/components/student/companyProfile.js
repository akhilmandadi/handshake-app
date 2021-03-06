import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

class ViewCompanyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: {},
            name: "",
            location: "",
            description: "",
            contact_num: "",
            contact_name: "",
            contact_email: ""
        }
        this.fetchCompanyDetails = this.fetchCompanyDetails.bind(this)
    }

    componentDidMount() {
        this.fetchCompanyDetails();
    }

    fetchCompanyDetails = () => {
        const { match: { params } } = this.props;
        let url = process.env.REACT_APP_BACKEND_URL + 'company?id=' + params.companyId;
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    var base64Flag = 'data:image/jpeg;base64,';
                    if (response.data.image !== null) {
                        var imageStr = this.arrayBufferToBase64(response.data.image.data);
                        response.data.image = base64Flag + imageStr
                    }
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

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    render() {
        return (
            <div style={{ marginTop: "30px" }}>
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">
                            <Card>
                                <CardContent style={{ textAlign: "-webkit-right" }} >
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        {this.state.company.image === null ? (
                                            <Avatar variant="circle" style={{ paddingRight: "0px", width: "110px", height: "110px", margin: "15px", backgroundColor: "brown" }}>
                                                <h3>{this.state.company.name}</h3>
                                            </Avatar>
                                        ) : (
                                                <Avatar variant="circle" src={this.state.company.image} style={{ paddingRight: "0px", width: "110px", height: "110px", margin: "15px", border: "0.5px solid" }} />
                                            )}
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
                            </Card>
                        </div>
                        <div class="col-md-8">
                            <Card style={{ marginBottom: "15px", paddingBottom: "15px", paddingTop: "15px" }}>
                                <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>Description</h4>
                                <div class="row" style={{ width: "100%" }}>
                                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                        <Typography gutterBottom variant="subtitle" style={{ marginLeft: "20px" }}>
                                            {(this.state.description === null || this.state.description === "") ? "NA" : this.state.description}
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                            <Card style={{ marginBottom: "0px", paddingBottom: "10px", paddingTop: "15px" }}>
                                <div class="row">
                                    <div class="col-md-10">
                                        <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>Contact Info</h4>
                                    </div>
                                </div>
                                <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                                    <div>
                                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><MailOutlineIcon style={{ fontSize: 25 }} color="primary" /></div>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                                &nbsp;&nbsp;{(this.state.contact_email === null || this.state.contact_email === "") ? "NA" : this.state.contact_email}
                                            </Typography>
                                            </div>
                                        </div>
                                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><PhoneIcon style={{ fontSize: 25 }} color="primary" /></div>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                                &nbsp;&nbsp;{(this.state.contact_num === null || this.state.contact_num === "") ? "NA" : this.state.contact_num}
                                            </Typography>
                                            </div>
                                        </div>
                                        <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><AssignmentIndIcon style={{ fontSize: 25 }} color="primary" /></div>
                                            <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                                                &nbsp;&nbsp;{(this.state.contact_name === null || this.state.contact_name === "") ? "NA" : this.state.contact_name}
                                            </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

export default ViewCompanyProfile;