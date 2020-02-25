import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import SignIn from "../components/signin";
import SignUp from "../components/signup";
import NavBar from "../components/navbar";
import Dashboard from "../components/dashboard";
import Jobs from "../components/jobs";
import Applications from "../components/applications";
import Students from "../components/students";
import StudentProfile from "../components/studentProfile";

import StudentApplications from "../components/student/applications";
import SearchJobs from "../components/student/searchJobs";
import StudentSearch from "../components/student/studentSearch";

class Routes extends Component {
    render() {
        return (
            <div>
                <Route path="/" component={NavBar} />
                <Route path="/signin" component={SignIn} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/signup" component={SignUp} />
                <Route path="/company/jobs" component={Jobs} />
                <Route path="/job/:jobId/applications" exact component={Applications} />
                <Route path="/students" exact component={Students} />
                <Route path="/students/:id" exact component={StudentProfile} />

                <Route path="/student/:id/applications" exact component={StudentApplications} />
                <Route path="/jobs" exact component={SearchJobs} />
                <Route path="/explore/students" exact component={StudentSearch} />
            </div>
        )
    }
}

export default Routes;