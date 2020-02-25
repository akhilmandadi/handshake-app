import React, { Component } from 'react';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import _ from 'lodash';
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import StudentNavBar from "./studentNavBar"

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

            Applied: false,
            Pending: false,
            Reviewed: false,
            Declined: false
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.searchstudentsByStatus = this.searchstudentsByStatus.bind(this)
        this.filterstudentsearchByStatus = this.filterstudentsearchByStatus.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)

        this.nameChangeFilter = this.nameChangeFilter.bind(this)
        this.filterStudentsByString = this.filterStudentsByString.bind(this)
        this.schoolChangeFilter = this.schoolChangeFilter.bind(this)
    }
    componentDidMount() {
        let url = 'http://localhost:8080/students?id=' + sessionStorage.getItem("id") + "&exclude=true";
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        students: response.data,
                        studentsFilter: response.data
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

    mergeFilters = () => {
        if (_.isEmpty(this.state.studentsFilterByName) || _.isEmpty(this.state.studentsFilterBySchool)) { this.setState({ students: [] }); return; }
        this.setState({
            students: _.intersectionBy(_.isEmpty(this.state.studentsFilterByName) ? this.state.studentsFilter : this.state.studentsFilterByName,
                _.isEmpty(this.state.studentsFilterBySchool) ? this.state.studentsFilter : this.state.studentsFilterBySchool,
                _.isEmpty(this.state.studentsFilterByMajor) ? this.state.studentsFilter : this.state.studentsFilterByMajor,
                'id')
        })
    }
    nameChangeFilter = (event) => {
        var studentArr = this.filterStudentsByString(this.state.studentsFilter, event.target.value, "name")
        this.setState({
            studentsFilterByName: studentArr,
            name: event.target.value,
        }, () => {
            if (_.isEmpty(this.state.studentsFilterBySchool) && _.isEmpty(this.state.studentsFilterByMajor) && this.state.school === "" && this.state.major === "") {
                this.setState({
                    students: studentArr
                })
            } else {
                this.mergeFilters()
            }
        })
    }

    schoolChangeFilter = (event) => {
        let studentArr = this.filterStudentsByString(this.state.studentsFilter, event.target.value, "college")
        this.setState({
            studentsFilterBySchool: studentArr,
            school: event.target.value
        }, () => {
            if (_.isEmpty(this.state.studentsFilterByName) && _.isEmpty(this.state.studentsFilterByMajor) && this.state.name === "" && this.state.major === "") {
                this.setState({
                    students: studentArr
                })
            } else {
                this.mergeFilters()
            }
        })
    }

    filterStudentsByString = (students, searchStr, searchAttribute) => {
        searchStr = searchStr.toLowerCase();
        return students.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (student[attribute] && attribute === searchAttribute) return student[attribute].toLowerCase().indexOf(searchStr) !== -1;
            });
        });
    }

    searchstudentsByStatus = async () => {
        let newData = await this.filterstudentsearchByStatus(this.state.studentsFilter)
        this.setState({
            students: newData
        })
    }

    filterstudentsearchByStatus = async (students) => {
        if (this.state.Applied === false && this.state.Pending === false && this.state.Reviewed === false && this.state.Declined === false) {
            return students
        }
        const isApplied = this.state.Applied;
        const isPending = this.state.Pending;
        const isReviewed = this.state.Reviewed;
        const isDeclined = this.state.Declined;
        const appliedApps = students.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isApplied === true) return student[attribute].toLowerCase().indexOf("applied") !== -1;
            });
        });
        const pendingApps = students.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isPending === true) return student[attribute].toLowerCase().indexOf("pending") !== -1;
            });
        });
        const reviewApps = students.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isReviewed === true) return student[attribute].toLowerCase().indexOf("reviewed") !== -1;
            });
        });
        const declinedApps = students.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isDeclined === true) return student[attribute].toLowerCase().indexOf("declined") !== -1;
            });
        });
        return [...appliedApps, ...pendingApps, ...declinedApps, ...reviewApps]
    }

    handleFilterChange = (value) => {
        if (value === 'Applied') this.setState({ Applied: !this.state.Applied, }, () => { this.searchstudentsByStatus() })
        if (value === 'Pending') this.setState({ Pending: !this.state.Pending, }, () => { this.searchstudentsByStatus() })
        if (value === 'Reviewed') this.setState({ Reviewed: !this.state.Reviewed, }, () => { this.searchstudentsByStatus() })
        if (value === 'Declined') this.setState({ Declined: !this.state.Declined, }, () => { this.searchstudentsByStatus() })
    }

    render() {
        let errorBanner = null;
        if (this.state.students.length === 0) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No students Found</b>
                    </CardContent >
                </Card >
            )
        }
        return (
            <div><StudentNavBar tab="explore" /><br />
                <div className="container" style={{ width: "90%", height: "100%" }}>
                    <Grid container spacing={3}>
                        <div style={{ alignContent: "center", width: "20%", marginRight: "20px", paddingBottom: "10px" }}>
                            <Card style={{ height: "10%", marginBottom: "1px" }}>
                                <h4 style={{ paddingLeft: "20px" }}>Filters</h4>
                            </Card>
                            <Card style={{ height: "20%", marginBottom: "1px" }}><CardContent>
                                <b>Name</b><br />
                                <input type="text" class="form-control" id="search" aria-describedby="search"
                                    placeholder="Enter a Name" onChange={this.nameChangeFilter}
                                />
                            </CardContent></Card>
                            <Card style={{ height: "20%", marginBottom: "1px" }}><CardContent>
                                <b>School</b><br />
                                <input type="text" class="form-control" id="search" aria-describedby="search"
                                    placeholder="Enter a School Name" onChange={this.schoolChangeFilter}
                                />
                            </CardContent></Card>
                            <Card style={{ height: "50%", marginBottom: "1px" }}><CardContent>
                                <div style={{ marginTop: "10px" }}><b>Major</b></div>
                                <FormControl component="fieldset" >
                                    <FormGroup >
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Applied} onChange={() => this.handleFilterChange("Applied")} value="Applied" />}
                                            label="Applied"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Pending} onChange={() => this.handleFilterChange("Pending")} value="Pending" />}
                                            label="Pending"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Reviewed} onChange={() => this.handleFilterChange("Reviewed")} value="Reviewed" color="primary" />}
                                            label="Reviewed"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={this.state.Declined} onChange={() => this.handleFilterChange("Declined")} value="Declined" color="primary" />}
                                            label="Declined"
                                        />
                                    </FormGroup>
                                </FormControl></CardContent>
                            </Card>
                        </div>
                        <div style={{ width: "75%" }}>
                            {this.state.students.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(student => {
                                return (
                                    <span style={{ alignContent: "right", padding: "0px" }} key={student.id}>
                                        <Card style={{ padding: "0px", marginBottom: "7px" }}>
                                            <div style={{ width: "10%", float: "left", height: "100%", alignItems: "center", overflow: "hidden" }}>
                                                <Avatar variant="circle" style={{ width: "60px", height: "60px", margin: "10px", backgroundColor: "orange" }}>
                                                    <b style={{ fontSize: "80" }}>{student.name.substring(0, 1)}</b>
                                                </Avatar>
                                            </div>
                                            <div style={{ width: "85%", height: "100%", overflowX: "float" }}>
                                                <CardContent style={{ paddingBottom: "5px" }}>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        <b>{student.name.toUpperCase()}</b>
                                                    </Typography>
                                                    <Typography color="textSecondary">
                                                        {student.college}
                                                    </Typography>
                                                    <Typography color="textSecondary" style={{ verticalAlign: "center" }}>
                                                        Status: {student.status}
                                                    </Typography>
                                                    <Typography color="textSecondary">
                                                        Applied
                                                    </Typography>
                                                </CardContent></div>
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