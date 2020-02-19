import React, { Component } from 'react';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: true,
            persona: "student"
        }
        this.changePersona = this.changePersona.bind(this);
    }

    changePersona = (event) => {
        this.setState({
            placeholder: !this.state.placeholder,
            persona: event.target.value
        })
    }
    render() {
        return (
            <div>
                <div class="container" style={{ width: "25%", border: "0px solid rgb(9, 3, 12)" }}>
                    <div class="login-form">
                        <div class="main-div">
                            <form>
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
                                <form>
                                <div class="form-group">
                                    <input type="text" class="form-control" name="name" placeholder="Name" required />
                                </div>
                                <div class="form-group">
                                    <input type="email" class="form-control" name="username" placeholder="Email Id" required />
                                </div>
                                <div class="form-group">
                                    <input type="password" class="form-control" name="password" placeholder="Password" required />
                                </div>
                                <div class="form-group">
                                    <input type="password" class="form-control" name="password" placeholder="Re-Enter Password" />
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control" name="location" placeholder={this.state.placeholder ? "College Name" : "Company"} required />
                                </div>
                                {false ? <span style={{ color: "red", "font-style": "oblique", "font-weight": "bold" }}>Invalid Username or Password</span> : ''}
                                <div style={{ textAlign: "center" }}>
                                    <button class="btn btn-success" style={{ "width": "100%" }}>Register</button>
                                </div>
                                <br />
                                </form>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;