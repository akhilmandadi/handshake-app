import React, { Component } from 'react';

class SignUp extends Component {
    render() {
        return (
            <div>
                <div class="container" style={{ width: "25%",border:"0.5px solid rgb(9, 3, 12)" }}>
                    <div class="login-form">
                        <div class="main-div">
                            <form>
                                <div class="panel">
                                    <h2 style={{ textAlign: "center" }}>Sign Up</h2>
                                </div>
                                <div>
                                    <div class="radio-inline">
                                        <input type="radio" name="persona" checked /><p>Student</p>
                                    </div>
                                    <div class="radio-inline">
                                        <input type="radio" name="persona" /><p>Company</p>
                                    </div>
                                </div>
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
                                    <input type="text" class="form-control" name="location" placeholder="Location" required />
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <button class="btn btn-success" style={{ "width": "100%" }}>Login</button>
                                </div>
                                <br />
                                {false ? <span style={{ color: "red", "font-style": "oblique", "font-weight": "bold" }}>Invalid Username or Password</span> : ''}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;