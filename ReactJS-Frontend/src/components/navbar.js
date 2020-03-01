import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../App.css';
import logo from '../favicon.ico';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout = () => {
        sessionStorage.removeItem("persona");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("id");
    }
    render() {
        let navBar = null;
        if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "company") {
            navBar = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to={"/company/profile"} style={{ color: "black" }}><span class="glyphicon glyphicon-user"></span> Profile</Link></li>
                    <li><Link to="/company/jobs" style={{ color: "black" }}><span class="glyphicon glyphicon-"></span>Jobs</Link></li>
                    <li><Link to="/company/events" style={{ color: "black" }}><span class="glyphicon glyphicon-"></span>Events</Link></li>
                    <li><Link to="/students" style={{ color: "black" }}><span class="glyphicon glyphicon-"></span>Students</Link></li>
                    <li><Link to="/signin" onClick={this.handleLogout} style={{ color: "black" }}><span class="glyphicon glyphicon-log-out"></span> Logout</Link></li>
                </ul>
            )
        } else if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("persona") === "student") {
            navBar = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/jobs" style={{ color: "black" }}><span class="glyphicon glyphicon-"></span> Jobs</Link></li>
                    <li><Link to="/events" style={{ color: "black" }}><span class="glyphicon glyphicon-"></span>Events</Link></li>
                    <li><Link to="/explore/students" style={{ color: "black" }}><span class="glyphicon glyphicon-"></span>Students</Link></li>
                    <li><Link to={"/student/profile"} style={{ color: "black" }}><span class="glyphicon glyphicon-user"></span> Profile</Link></li>
                    <li><Link to="/signin" onClick={this.handleLogout} style={{ color: "black" }}><span class="glyphicon glyphicon-log-out"></span> Logout</Link></li>
                </ul>
            )
        } else {
            navBar = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/signin" style={{ color: "black" }}><span class="glyphicon glyphicon-log-in"></span> LogIn</Link></li>
                    <li><Link to="/signup" style={{ color: "black" }}><span class="glyphicon glyphicon-user"></span> SignUp</Link></li>
                </ul>
            )
        }
        let redirectVar = <Redirect to="/signin" />
        return (
            <div>
                {redirectVar}
                <nav class="navbar  navbar-dark bg-dark" style={{ backgroundColor: "#fff", borderRadius: "0px", padding: "0px", margin: "0px",paddingTop:"3px",paddingBottom:"3px" }}>
                    <div class="container-fluid">
                        <div class="navbar-header" style={{ display: "inline" }}>
                            <b class="navbar-brand" style={{ color: "black", display: "inline" }}><img style={{ display: "inline", width: "35px", height: "35px" }} src={logo} /> Handshake</b>
                        </div>
                        <ul class="nav navbar-nav">
                        </ul>
                        {navBar}
                    </div>
                </nav>
            </div>
        )
    }
}

export default NavBar;