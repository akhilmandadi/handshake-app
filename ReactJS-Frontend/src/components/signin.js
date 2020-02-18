import React, { Component } from 'react';

class SignIn extends Component {
    render() {
        return (
            <div>
                <div class="container" style={{ width: "25%", border: "0.5px solid rgb(9, 3, 12)" }}>
                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <h2 style={{ textAlign: "center" }}>Sign In</h2>
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
                                <input type="text" class="form-control" name="username" placeholder="Username" />
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" name="password" placeholder="Password" />
                            </div>
                            <div class="form-group" style={{ "alignItems": "center" }}>
                                {true ? <span style={{ color: "red", "font-style": "oblique", "font-weight": "bold", "textAlign": "center" }}>Invalid Username or Password</span> : ''}
                            </div>

                            <div style={{ textAlign: "center" }}>
                                <button class="btn btn-success" style={{ "width": "100%" }}>Login</button>
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn;