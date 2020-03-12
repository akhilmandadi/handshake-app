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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

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
            enableProfileEdit: false,
            img: "",
            imageUploadModal: false,
            file: null
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
        this.enableApplyModal = this.enableApplyModal.bind(this)
        this.closeImageModal = this.closeImageModal.bind(this)
        this.uploadProfilePicture = this.uploadProfilePicture.bind(this)
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.fetchCompanyDetails();
    }

    fetchCompanyDetails = () => {
        let url = process.env.REACT_APP_BACKEND_URL + 'company?id=' + sessionStorage.getItem("id");
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
                        company: response.data,
                        name: response.data.name,
                        location: response.data.location,
                        description: response.data.description,
                        contact_num: response.data.contact_num,
                        contact_name: response.data.contact_name,
                        contact_email: response.data.contact_email,

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

    uploadProfilePicture = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post(process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + "/image", formData, config)
            .then((response) => {
                this.fetchCompanyDetails();
                this.setState({
                    imageUploadModal: false,
                    file: null
                })
            }).catch((error) => {
            });
    }


    closeImageModal = () => {
        this.setState({
            imageUploadModal: false
        })
    }

    enableApplyModal = () => {
        this.setState({
            imageUploadModal: !this.state.imageUploadModal
        })
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

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
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/profile';
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
            enableContactSave: !this.state.enableContactSave
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
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            contact_name: this.state.contact_name,
            contact_num: this.state.contact_num,
            contact_email: this.state.contact_email
        })
            .then(response => {
                if (response.status === 200) {
                    this.fetchCompanyDetails();
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
            enableProfileEdit: !this.state.enableProfileEdit
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

    profileSaveHandler = (e) => {
        e.preventDefault();
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            name: this.state.name,
            location: this.state.location
        })
            .then(response => {
                if (response.status === 200) {
                    this.fetchCompanyDetails();
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
                        <button type="button" onClick={this.enableContactEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black", marginRight: "5px" }} class="btn btn-secondary" >Cancel</button>
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
                        {this.state.company.image === null ? (
                            <Avatar className="changePhoto" title="Upload Profile Picture" onClick={this.enableApplyModal} variant="circle" style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", backgroundColor: "brown" }}>
                                <h3>{this.state.company.name}</h3>
                            </Avatar>
                        ) : (
                                <Avatar className="changePhoto" title="Change Profile Picture" onClick={this.enableApplyModal} variant="circle" src={this.state.company.image} style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", border: "0.5px solid" }} />
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
            )
        } else {
            profileSave = (
                <CardContent >
                    <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                        <form onSubmit={this.profileSaveHandler}>
                            <div style={{ textAlign: "-webkit-center" }}>
                                {this.state.company.image === null ? (
                                    <Avatar className="changePhoto" title="Upload Profile Picture" onClick={this.enableApplyModal} variant="circle" style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", backgroundColor: "brown" }}>
                                        <h3>{this.state.company.name}</h3>
                                    </Avatar>
                                ) : (
                                        <Avatar className="changePhoto" title="Change Profile Picture" onClick={this.enableApplyModal} variant="circle" src={this.state.company.image} style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", border: "0.5px solid" }} />
                                    )}
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
                                <button type="button" onClick={this.enableProfileEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black", marginRight: "5px" }} class="btn btn-secondary" >Cancel</button>
                                <button type="submit" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" >Save</button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            )
        }
        return (
            <div style={{ marginTop: "30px" }}>
                <Dialog style={{ minWidth: "400px" }} open={this.state.imageUploadModal} onClose={this.closeImageModal} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title"><h4>Edit Profile Picture</h4></DialogTitle>
                    <form onSubmit={this.uploadProfilePicture}>
                        <DialogContent>
                            <h5>Attach your Photo</h5>
                            <div class="form-group">
                                <input type="file" class="form-control-file" name="image"
                                    id="exampleFormControlFile1" onChange={this.onChange} />
                            </div>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeImageModal} color="secondary">
                                Cancel
                        </Button>
                            <button type="submit" class="btn btn-success" onClick={this.uploadProfilePicture}>Save</button>
                        </DialogActions>
                    </form>
                </Dialog>
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