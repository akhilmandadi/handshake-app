import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../../App.css';

class StudentNavBar extends Component {
    constructor(props) {
        super(props);
        this.tab = this.props.tab;
    }
    render() {
        let navBar = null;
        if (this.tab === "jobs") {
            navBar = (
                <div class="container-fluid">
                    <div class="navbar-header">
                        <b class="navbar-brand" style={{ color: "white" }}>Jobs</b>
                    </div>
                    <ul class="nav navbar-nav">
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/jobs" style={{ color: "white" }}><span class="glyphicon glyphicon-user"></span> Job Search</Link></li>
                        <li><Link to={"/student/" + sessionStorage.getItem("id") + "/applications"} style={{ color: "white" }}><span class="glyphicon glyphicon-"></span>Applications</Link></li>
                    </ul>
                </div>
            )
        } else if (this.tab === "events") {
            navBar = (
                <div class="container-fluid">
                    <div class="navbar-header">
                        <b class="navbar-brand" style={{ color: "white" }}>Events</b>
                    </div>
                    <ul class="nav navbar-nav">
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/profile" style={{ color: "white" }}><span class="glyphicon glyphicon-user"></span> Events Search</Link></li>
                        <li><Link to="/company/jobs" style={{ color: "white" }}><span class="glyphicon glyphicon-"></span>Registrations</Link></li>
                    </ul>
                </div>
            )
        }
        return (
            <div className="inner" style={{ marginBottom: "0px" }}>
                <nav className="inner" class="navbar  navbar-dark bg-dark" style={{ backgroundColor: "#4b4bc4", height: "10px", borderRadius: "0px", padding: "0px", margin: "0px" }}>
                    {navBar}
                </nav>
            </div>
        )
    }
}

export default StudentNavBar;