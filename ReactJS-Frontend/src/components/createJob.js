import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect } from 'react-router';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Icon from '@material-ui/core/Icon';

class CreateJob extends Component {
    constructor(props) {
        super(props);
        this.enableCreate = this.props.enableCreate;
        this.state = {
            title: "",
            location: "",
            salary: "",
            description: "",
            category: "",
            deadline: "",
            posting_date: "",
            postBookError: false
        }
        this.handleCreateJobClose = this.handleCreateJobClose.bind(this)
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.salaryChangeHandler = this.salaryChangeHandler.bind(this);
        this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.deadlineChangeHandler = this.deadlineChangeHandler.bind(this);
        this.postingDateChangeHandler = this.postingDateChangeHandler.bind(this);
        this.addJob = this.addJob.bind(this);
        this.validateDetails = this.validateDetails.bind(this);
    }

    addJob = (event) => {
        event.preventDefault();
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/jobs';
        var data = {
            "title": this.state.title,
            "deadline": this.state.deadline,
            "location": this.state.location,
            "salary": this.state.salary,
            "description": this.state.description,
            "category": this.state.category,
            "posting_date": new Date().toISOString().slice(0, 10)
        }
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.handleCreateJobClose()
                    this.props.updateJobs()
                } else {
                    this.setState({
                        postBookError: true,
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    postBookError: true,
                })
            });
    }

    titleChangeHandler = (event) => {
        this.setState({
            title: event.target.value
        })
    }
    locationChangeHandler = (event) => {
        this.setState({
            location: event.target.value
        })
    }
    salaryChangeHandler = (event) => {
        this.setState({
            salary: event.target.value
        })
    }
    descriptionChangeHandler = (event) => {
        this.setState({
            description: event.target.value
        })
    }
    categoryChangeHandler = (event) => {
        this.setState({
            category: event.target.value
        })
    }
    postingDateChangeHandler = (event) => {
        this.setState({
            posting_date: event.target.value
        })
    }
    deadlineChangeHandler = (event) => {
        this.setState({
            deadline: event.target.value
        })
    }
    validateDetails = (event) => {
        if (this.state.title !== "" && this.state.location !== "" && this.state.salary !== "" && this.state.description !== "" && this.state.category !== "" && this.state.deadline !== "") return false
        else return true
    }

    handleCreateJobClose = () => {
        this.props.toggleCreate();
    }
    render() {
        let redirectToSignIn = null;
        if (this.state.redirectToSignIn) redirectToSignIn = <Redirect to="/signin" />
        return (
            <div>
                <Dialog fullWidth="120" open={this.enableCreate} onClose={this.handleCreateJobClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New Job Posting</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                label="Title"
                                type="text"
                                fullWidth
                                variant="outlined"
                                required
                                onChange={this.titleChangeHandler}
                            />
                            <TextField
                                margin="dense"
                                id="location"
                                label="Location"
                                type="location"
                                fullWidth
                                variant="outlined"
                                required
                                onChange={this.locationChangeHandler}
                            />
                            <TextField
                                margin="dense"
                                id="salary"
                                label="Salary"
                                type="salary"
                                fullWidth
                                variant="outlined"
                                required
                                onChange={this.salaryChangeHandler}
                            />
                            <TextField
                                margin="dense"
                                id="description"
                                label="Description"
                                type="description"
                                fullWidth
                                multiline
                                rows="3"
                                variant="outlined"
                                placeholder="Description"
                                required
                                onChange={this.descriptionChangeHandler}
                            />
                            <FormControl required minWidth="120" style={{ width: "50%" }}>
                                <InputLabel id="demo-simple-select-required-label" style={{ width: "120px" }}>Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-required-label"
                                    id="demo-simple-select-required"
                                    defaultValue={"Full-Time"}
                                    onChange={this.categoryChangeHandler}
                                >
                                    <MenuItem value={"Full-Time"}>Full-Time</MenuItem>
                                    <MenuItem value={"Part-Time"}>Part-Time</MenuItem>
                                    <MenuItem value={"Internship"}>Intern</MenuItem>
                                    <MenuItem value={"On-Campus"}>On-Campus</MenuItem>
                                </Select>
                                <FormHelperText>Required</FormHelperText>
                            </FormControl>
                            <br />
                            <TextField
                                id="date"
                                label="Deadline"
                                type="date"
                                defaultValue={new Date().toISOString().slice(0, 10)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.deadlineChangeHandler}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCreateJobClose} color="primary">
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<Icon>send</Icon>}
                            onClick={this.addJob}
                            disabled={this.validateDetails()}
                        >
                            Post
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default CreateJob;