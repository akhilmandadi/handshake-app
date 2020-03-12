import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';

class SkillCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            skills: [],
            newSkill: ""
        }
        this.skillSaveHandler = this.skillSaveHandler.bind(this)
        this.skillChangeHandler = this.skillChangeHandler.bind(this)
        this.skillDeleteHandler = this.skillDeleteHandler.bind(this)
        this.skillDelete = this.skillDelete.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            student: nextProps.student,
            skills: nextProps.student.skills === null ? [] : nextProps.student.skills.split(",")
        })
    }

    skillSaveHandler = (event) => {
        let skillString = this.state.skills.toString() + "," + this.state.newSkill;
        if (this.state.skills.length === 0) skillString = this.state.newSkill
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            skills: skillString
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        newSkill: ""
                    })
                    this.props.fetchStudentDetails()
                }
            })
            .catch((error) => {
                this.props.fetchStudentDetails()
            });
    }

    skillDelete = (event) => {
        let skillString = this.state.skills.toString();
        let url = process.env.REACT_APP_BACKEND_URL + 'student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            skills: skillString
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        newSkill: ""
                    })
                    this.props.fetchStudentDetails()
                }
            })
            .catch((error) => {
                this.props.fetchStudentDetails()
            });
    }

    skillChangeHandler = (event) => {
        this.setState({
            newSkill: event.target.value
        })
    }

    skillDeleteHandler = (index) => {
        let skillSet = this.state.skills;
        skillSet.splice(index, 1)
        this.setState({
            skills: skillSet
        }, () => {
            this.skillDelete();
        })
    }

    render() {
        let skillsChips = null;
        if (this.state.skills.length > 0) {
            skillsChips = (
                <span>
                    {this.state.skills.map((skill, index) => {
                        return (
                            <Chip
                                label={<h6>{skill}</h6>}
                                variant="outlined"
                                onDelete={() => this.skillDeleteHandler(index)}
                                deleteIcon={<CloseIcon />}
                                style={{ height: "25px", "marginRight": "4px", marginBottom: "5px", borderRadius: "4px", border: "0px", backgroundColor: "#f0f0f0", padding: "0px" }}
                            />
                        )
                    })}
                </span>
            )
        } else {
            skillsChips = null
        }
        return (
            <div style={{}}>
                <Card style={{ marginBottom: "15px", paddingBottom: "0px", paddingTop: "0px", paddingLeft: "5px", paddingRight: "5px" }}>
                    <CardContent style={{}} >
                        <div className="row" style={{ marginLeft: "0px", marginRight: "0px" }}>
                            <div className="row" style={{ marginLeft: "0px", marginRight: "0px", marginBottom: "0px" }}>
                                <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "0px", marginTop: "0px" }}>Skills</h4>
                            </div>
                            <div className="row" style={{ marginLeft: "0px", marginRight: "0px", marginBottom: "10px" }}>
                                {skillsChips}
                            </div>
                            <div className="row">
                                <div class="col-md-8" style={{ marginRight: "0px", paddingRight: "7px" }}>
                                    <input required onChange={this.skillChangeHandler} value={this.state.newSkill} type="text" class="form-control" id="name" aria-describedby="name" placeholder="Add more skills"></input>
                                </div>
                                <div class="col-md-3" style={{ textAlign: "-webkit-center", marginLeft: "0px", paddingLeft: "0px" }}>
                                    <button type="button" onClick={this.skillSaveHandler} style={{ backgroundColor: "#0d7f02", width: "100%" }} class="btn btn-success" >Add</button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div >
        )
    }
}


export default SkillCard;