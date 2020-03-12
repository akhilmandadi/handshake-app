import React, { Component } from 'react';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import _ from 'lodash';
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import StudentNavBar from "./studentNavBar"
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

class StudentSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25,
            students: [],
            studentsFilter: [],
            studentsFilterByName: [],
            studentsFilterBySchool: [],
            studentsFilterByMajor: [],
            name: "",
            major: "",
            school: "",
            majors: [],
            majorFilter: []
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.filterJobs = this.filterJobs.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleMajorChange = this.handleMajorChange.bind(this)
    }
    componentDidMount() {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/profiles?id=' + sessionStorage.getItem("id");
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    response.data.map(student => {
                        if (student.image !== null) {
                            var imageStr = this.arrayBufferToBase64(student.image.data);
                            student.image = 'data:image/jpeg;base64,' + imageStr
                        }
                    })
                    let filters = []
                    response.data.map(student => {
                        student.education.map((education, index) => {
                            if (index === 0) filters.push(education.major)
                        })
                    })
                    this.setState({
                        students: response.data,
                        studentsFilter: response.data,
                        majors: _.uniq(filters)
                    })
                } else {
                    this.setState({
                        students: [],
                        studentsFilter: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    students: [],
                    studentsFilter: []
                })
            });
    }
    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0
        })
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value },
            () => {
                this.filterJobs()
            });
    }

    filterCategory = (education) => {
        if (_.isEmpty(this.state.majorFilter)) return true
        if (_.isEmpty(education)) return false
        return this.state.majorFilter.indexOf(education[0]["major"]) > -1
    }

    filterJobs = () => {
        let newStudents = []
        this.state.studentsFilter.map((student, index) => {
            if (student.name.toLowerCase().includes(this.state.name.toLowerCase()) &&
                student.college.toLowerCase().includes(this.state.school.toLowerCase()) &&
                this.filterCategory(student.education)
            ) {
                newStudents.push(student)
            }
        })
        this.setState({
            students: newStudents
        })
    }
    handleMajorChange = (event) => {
        let majors = this.state.majorFilter;
        let index = majors.indexOf(event.target.value)
        if (index === -1) majors.push(event.target.value)
        else majors.splice(index, 1)
        this.setState({
            majorFilter: majors
        }, () => {
            this.filterJobs()
        })
    }

    render() {
        let errorBanner = null;
        if (this.state.students.length === 0) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No Students Found</b>
                    </CardContent >
                </Card >
            )
        }
        let loadingView = null;
        if (_.isEmpty(this.state.students)) {
            loadingView = (
                <div style={{ zIndex: "1000" }}>
                    <Card style={{ zIndex: "100000", width: "100%", height: "600px", textAlign: "-webkit-center" }}>
                        <div style={{ marginTop: "200px", width: "200px" }}>
                            <CircularProgress />
                        </div>
                    </Card>
                </div>
            )
        }
        const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return (
            <div><StudentNavBar tab="explore" /><br />
                <div className="container" style={{ width: "90%", height: "100%" }}>
                    <Grid container spacing={3}>
                        <div style={{ alignContent: "center", width: "20%", marginRight: "20px", paddingBottom: "10px" }}>
                            <Card style={{ height: "10%", marginBottom: "1px" }}>
                                <h4 style={{ paddingLeft: "20px" }}>Filters</h4>
                            </Card>
                            <Card style={{ height: "27%", marginBottom: "1px", padding: "20px" }}>
                                <b>Name</b><br />
                                <input type="text" class="form-control" id="search" aria-describedby="search"
                                    placeholder="Enter a Name" name="name" onChange={this.handleChange} style={{ marginBottom: "50px" }}
                                />
                            </Card>
                            <Card style={{ height: "27%", marginBottom: "1px", padding: "20px" }}>
                                <b>School</b><br />
                                <input type="text" class="form-control" id="search" aria-describedby="search"
                                    placeholder="Enter a School Name" name="school" onChange={this.handleChange}
                                />
                            </Card>
                            <Card style={{ height: "50%", marginBottom: "1px" }}><CardContent>
                                <div style={{ marginTop: "10px" }}><b>Major</b></div>
                                {this.state.majors.map(major => {
                                    return (
                                        <div class="form-check">
                                            <input class="form-check-input position-static" type="checkbox"
                                                id={major} value={major} onChange={this.handleMajorChange} />
                                            &nbsp;{major}
                                        </div>
                                    )
                                })}
                            </CardContent>
                            </Card>
                        </div>
                        <div style={{ width: "75%" }}>
                            {this.state.students.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(student => {
                                return (
                                    <span style={{ alignContent: "right", padding: "0px" }} key={student.id}>
                                        <Card style={{ padding: "0px", marginBottom: "7px", paddingBottom: "7px" }}>
                                            <div class="row" style={{ width: "100%" }}>
                                                <div class="col-md-1" style={{ textAlign: "-webkit-center", float: "left", alignItems: "center", paddingRight: "0px", marginRight: "15px" }}>
                                                    {student.image === null ? (
                                                        <Avatar variant="circle" style={{ paddingRight: "0px", width: "50px", height: "50px", margin: "10px", backgroundColor: "brown" }}>
                                                            <b style={{ fontSize: "80" }}>{student.name.substring(0, 1)}</b>
                                                        </Avatar>
                                                    ) : (
                                                            <Avatar variant="circle" src={student.image} style={{ paddingRight: "0px", width: "50px", height: "50px", margin: "10px", border: "0.5px solid" }} />
                                                        )}
                                                </div>
                                                <div class="col-md-9" style={{ textAlign: "-webkit-left", paddingTop: "10px", marginLeft: "0px" }}>
                                                    <Typography gutterBottom variant="h5" style={{ marginBottom: "0px" }}>
                                                        <Link to={'/students/' + student.id} style={{ color: "black" }}><b>{student.name.toUpperCase()}</b></Link>
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {student.college}
                                                    </Typography>
                                                    <div className="row" >
                                                        <div className="col-md-6">
                                                            <Typography variant="h6" style={{ verticalAlign: "center", marginBottom: "9px" }} style={{ fontWeight: "500" }}>
                                                                {student.education.length === 0 ? "" : student.education[0].degree + ", " + months[student.education[0].month_of_passing] + " '" +
                                                                    (student.education[0].year_of_passing.toString()).substring(2, 4)}
                                                            </Typography>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Typography variant="h6" style={{ verticalAlign: "center", marginBottom: "9px" }} style={{ fontWeight: "500" }}>
                                                                {student.education.length === 0 ? "" : student.education[0].major}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                    <Typography variant="h6" style={{ verticalAlign: "center" }} style={{ fontWeight: "500" }}>
                                                        {student.experience.length > 0 ? (
                                                            student.experience.map(experience => {
                                                                return (
                                                                    <p style={{ marginBottom: "0px" }}><span class="glyphicon glyphicon-briefcase"></span> {experience.title} at {experience.company}</p>
                                                                )
                                                            })
                                                        ) : (
                                                                <b />
                                                            )}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Card>
                                    </span>
                                );
                            })}
                            <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                            <TablePagination
                                rowsPerPageOptions={[25, 50]}
                                component="div"
                                count={this.state.students.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </div>
                    </Grid>
                </div ></div>
        )
    }
}

export default StudentSearch;