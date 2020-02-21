import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect } from 'react-router';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: true,
            persona: "student",
            email: "",
            password: "",
            invalidEmail: false,
            invalidPassword: false,
            repeatPassword: "",
            passwordMatch: false,
            name: "",
            location: "",
            signUpSuccessful: false,
            redirectToSignIn: false,
            passwordMatchError: false,
            signupFailedError: false,
        }
        this.changePersona = this.changePersona.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.rePasswordChangeHandler = this.rePasswordChangeHandler.bind(this);
        this.validateDetails = this.validateDetails.bind(this);
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
    }

    registerUser = (event) => {
        event.preventDefault();
        let url = 'http://localhost:8080/signup?persona=' + this.state.persona;
        var data = {
            "email": this.state.email,
            "password": this.state.password,
            "name": this.state.name
        }
        if (this.state.persona === "company") data.location = this.state.location;
        else data.college = this.state.location;
        axios.defaults.withCredentials = true;
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        signUpSuccessful: true,
                    })
                } else {
                    this.setState({
                        signUpSuccessful: false,
                        signupFailedError:true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    signUpSuccessful: false,
                    signupFailedError:true
                })
            });;
    }

    changePersona = (event) => {
        this.setState({
            placeholder: !this.state.placeholder,
            persona: event.target.value
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

    emailChangeHandler = (event) => {
        if (/.+@.+\.[A-Za-z]+$/.test(event.target.value)) {
            this.setState({
                invalidEmail: false,
                email: event.target.value
            })
        } else {
            this.setState({
                invalidEmail: true,
                email: event.target.value
            })
        }
    }

    passwordChangeHandler = (event) => {
        if (event.target.value.length > 5) {
            this.setState({
                password: event.target.value,
                invalidPassword: false
            })
            if (this.state.repeatPassword !== event.target.value && this.state.repeatPassword !== "") {
                this.setState({
                    passwordMatch: false
                })
            }
        } else {
            this.setState({
                password: event.target.value,
                invalidPassword: true
            })
        }
    }

    rePasswordChangeHandler = (event) => {
        if (this.state.password === event.target.value) {
            this.setState({
                repeatPassword: event.target.value,
                passwordMatch: true,
                passwordMatchError:false
            })
        } else {
            this.setState({
                repeatPassword: event.target.value,
                passwordMatch: false,
                passwordMatchError:true
            })
        }
    }

    validateDetails = (event) => {
        if (!this.state.invalidEmail && !this.state.invalidPassword && this.state.passwordMatch && this.state.name !== "" && this.state.location !== "") return false
        else return true
    }
    handleDialogClose = () => {
        this.setState({
            redirectToSignIn: true
        })
    }
    render() {
        //const { location, name } = this.state;
        let redirectToSignIn = null;
        if (this.state.redirectToSignIn) redirectToSignIn = <Redirect to="/signin" />
        return (
            <div>
                {redirectToSignIn}
                <div class="container" style={{ width: "30%", border: "0px solid rgb(9, 3, 12)" }}>
                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2 style={{ textAlign: "center" }}>Sign Up</h2>
                            </div>
                            <div>
                                <div class="radio-inline">
                                    <input type="radio" value="student" name="persona" defaultChecked onChange={this.changePersona} /><p>I'm a Student</p>
                                </div>
                                <div class="radio-inline">
                                    <input type="radio" value="company" name="persona" onChange={this.changePersona} /><p>I'm a Company</p>
                                </div>
                            </div>
                            <form onSubmit={this.registerUser}>
                                <div class="form-group">
                                    <input type="text" onChange={this.nameChangeHandler} class="form-control" name="name" placeholder={this.state.placeholder ? "Name" : "Company Name"} required />
                                </div>
                                <div class="form-group">
                                    <input type="email" onChange={this.emailChangeHandler} class="form-control" name="email" placeholder="Email Id" required />
                                </div>
                                <div class="form-group" style={{ "alignItems": "center" }}>
                                    {this.state.invalidEmail ? <span style={{ color: "red", "textAlign": "center" }}>Invalid Email Id. Please check</span> : ''}
                                </div>
                                <div class="form-group">
                                    <input type="password" onChange={this.passwordChangeHandler} class="form-control" name="password" placeholder="Password" required />
                                </div>
                                <div class="form-group" style={{ "alignItems": "center" }}>
                                    {this.state.invalidPassword ? <span style={{ color: "red", "textAlign": "center" }}>Password must have atleast 6 characters</span> : ''}
                                </div>
                                <div class="form-group">
                                    <input type="password" onChange={this.rePasswordChangeHandler} class="form-control" name="repeatPassword" placeholder="Re-Enter Password" />
                                </div>
                                <div class="form-group" style={{ "alignItems": "center" }}>
                                    {this.state.passwordMatchError ? <span style={{ color: "red", "textAlign": "center" }}>Passwords doesn't match</span> : ''}
                                </div>
                                <div class="form-group">
                                    <input type="text" onChange={this.locationChangeHandler} class="form-control" name="location" placeholder={this.state.placeholder ? "College Name" : "Location"} required />
                                </div>
                                <div class="form-group" style={{ "alignItems": "center" }}>
                                    {this.state.signupFailedError ? <span style={{ color: "red", "font-style": "oblique", "font-weight": "bold", "textAlign": "center" }}>SignUp Failed. Please try again..</span> : ''}
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <button disabled={this.validateDetails()} class="btn btn-success" style={{ "width": "100%" }}>Register</button>
                                </div>
                                <br />

                                <div style={{ textAlign: "center" }}>
                                    <Link to="/signin">Already a User? Sign In</Link>
                                </div>
                            </form>
                            <div>
                                <Dialog
                                    open={this.state.signUpSuccessful}
                                    onClose={this.handleDialogClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{"Registered Successfully .!"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Hey {this.state.name},
                                            You've been signup succesfully. Please go ahead and login
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.handleDialogClose} color="primary" autoFocus>
                                            Login
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;