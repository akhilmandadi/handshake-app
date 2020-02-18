import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import '../App.css';

//create the Navbar Component
class NavBar extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }
    render() {
        //if Cookie is set render Logout Button
        // let navLogin = null;
        // if (cookie.load('cookie')) {
        //     console.log("Able to read cookie");
        //     navLogin = (
        //         <ul class="nav navbar-nav navbar-right">
        //             <li><Link to="/" onClick={this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
        //         </ul>
        //     );
        // } else {
        //     //Else display login button
        //     console.log("Not Able to read cookie");
        //     navLogin = (
        //         <ul class="nav navbar-nav navbar-right">
        //             <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span> Login</Link></li>
        //         </ul>
        //     )
        // }
        let redirectVar = null;
        if (cookie.load('cookie')) {
            redirectVar = <Redirect to="/" />
        } else {
            redirectVar = <Redirect to="/signin" />
        }
        return (
            <div>
                {redirectVar}
                <nav class="navbar  navbar-dark bg-dark" style={{ backgroundColor: "teal" }}>
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <b class="navbar-brand" style={{ color: "white" }}>Handshake</b>
                        </div>
                        <ul class="nav navbar-nav">
                        </ul>
                        <ul class="nav navbar-nav navbar-right">
                            <li><Link to="/home" className="ban" style={{ color: "white" }}>Jobs</Link></li>
                            <li><Link to="/create" style={{ color: "white" }}>Events</Link></li>
                            <li><Link to="/delete" style={{ color: "white" }}>Students</Link></li>
                            <li><Link to="/signin" style={{ color: "white" }}><span class="glyphicon glyphicon-log-in"></span> LogIn</Link></li>
                            <li><Link to="/signup" style={{ color: "white" }}><span class="glyphicon glyphicon-user"></span> SignUp</Link></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

export default NavBar;