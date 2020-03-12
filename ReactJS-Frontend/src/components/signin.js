import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs'
import logo from './handshakeLogin.PNG';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidCredentials: '',
            persona: "student",
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
        let url = process.env.REACT_APP_BACKEND_URL + 'signin?persona=' + this.state.persona + '&email=' + this.state.email;
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    if (bcrypt.compareSync(this.state.password, response.data.password)) {
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
        console.log(new Date().toISOString().slice(0, 10))
        if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "company") {
            home = <Redirect to="/company/jobs" />
        }
        if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "student") {
            home = <Redirect to={"/jobs"} />
        }
        return (
            <div >
                {home}
                <div class="container" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                    <div className="row" >
                        <div className="col-md-5" style={{ width: "450px", backgroundColor: "1569e0", backgroundColor: "white", height: "520px" }}>
                            <img src={logo} style={{ width: "450px", height: "520px" }} />
                        </div>
                        <div className="col-md-7" style={{
                            backgroundColor: "white", width: "400px",
                            border: "0px solid rgb(9, 3, 12)", borderRadius: "5px", padding: "50px", paddingTop: "20px", marginLeft: "220px", marginTop: "50px"
                        }}>
                            <div class="login-form row">
                                <div class="main-div">
                                    <div class="panel">
                                        <h2 style={{ textAlign: "center" }}>Sign In</h2>
                                    </div>
                                    <div className="row" style={{ marginLeft: "35px", marginBottom: "10px", marginTop: "30px" }}>
                                        <div class="col-md-5 radio-inline">
                                            <input type="radio" value="student" name="persona" onChange={this.changePersona} defaultChecked /><p>I'm a Student</p>
                                        </div>
                                        <div class="col-md-5 radio-inline">
                                            <input type="radio" value="company" name="persona" onChange={this.changePersona} /><p>I'm a Company</p>
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
                </div>
            </div>
        )
    }
}

export default SignIn;