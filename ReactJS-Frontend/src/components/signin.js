import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidCredentials: '',
            persona: "company",
            email: "",
            password: "",
            invalidEmail: false
        }
        this.changePersona = this.changePersona.bind(this);
        this.authenticateUser = this.authenticateUser.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.validateCredentials = this.validateCredentials.bind(this);
    }

    changePersona = (event) => {
        this.setState({
            persona: event.target.value
        })
    }

    authenticateUser = (event) => {
        event.preventDefault();
        let url = 'http://localhost:8080/signin?persona=' + this.state.persona + '&email=' + this.state.email + '&password=' + this.state.password;
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    sessionStorage.setItem("persona", this.state.persona);
                    sessionStorage.setItem("email", this.state.email);
                    sessionStorage.setItem("id", response.data.id);
                    sessionStorage.setItem("name", response.data.name);
                    this.setState({
                        invalidCredentials: false
                    })
                } else {
                    this.setState({
                        invalidCredentials: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    invalidCredentials: true
                })
            });;
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
        this.setState({
            password: event.target.value
        })
    }

    validateCredentials = (event) => {
        if (!this.state.invalidEmail && this.state.password !== "") return false
        else return true
    }

    render() {
        let home = null;
        //if (this.state.invalidCredentials === false) {
        if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "company") {
            home = <Redirect to="/students" />
        }
        return (
            <div>
                {home}
                <div class="container" style={{ width: "30%", border: "0px solid rgb(9, 3, 12)" }}>
                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2 style={{ textAlign: "center" }}>Sign In</h2>
                            </div>
                            <div>
                                <div class="radio-inline">
                                    <input type="radio" style={{ color: "black" }} value="student" name="persona"  onChange={this.changePersona} /><p>I'm a Student</p>
                                </div>
                                <div class="radio-inline">
                                    <input type="radio" value="company" name="persona" onChange={this.changePersona} defaultChecked /><p>I'm a Company</p>
                                </div>
                            </div>
                            <form className="form" onSubmit={this.authenticateUser}>
                                <div class="form-group">
                                    <input type="email" onChange={this.emailChangeHandler} style={{ backgroundColor: "" }} class="form-control" name="emailId" placeholder="Email Id" required />
                                </div>
                                <div class="form-group" style={{ "alignItems": "center" }}>
                                    {this.state.invalidEmail ? <span style={{ color: "red", "font-weight": "bold", "textAlign": "center" }}>Invalid Email Id. Please check</span> : ''}
                                </div>
                                <div class="form-group">
                                    <input type="password" onChange={this.passwordChangeHandler} class="form-control" name="password" placeholder="Password" required />
                                </div>
                                <div class="form-group" style={{ "alignItems": "center" }}>
                                    {this.state.invalidCredentials ? <span style={{ color: "red", "font-style": "oblique", "font-weight": "bold", "textAlign": "center" }}>Invalid Username or Password</span> : ''}
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <button disabled={this.validateCredentials()} class="btn btn-success" style={{ "width": "100%" }}>Login</button>
                                </div>
                                <br />
                                <div style={{ textAlign: "center" }}>
                                    <Link to="/signup">Not a User? Sign Up</Link>
                                </div>
                            </form>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn;