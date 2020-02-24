import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import SchoolIcon from '@material-ui/icons/School';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import CakeIcon from '@material-ui/icons/Cake';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';


class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            page: 0,
            rowsPerPage: 25,
            studentsFilter: []
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.searchStudents = this.searchStudents.bind(this)
        this.filterStudentSearch = this.filterStudentSearch.bind(this)
    }
    componentDidMount() {
        let url = 'http://localhost:8080/students';
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

    searchStudents = (event) => {
        this.setState({
            students: this.filterStudentSearch(this.state.studentsFilter, event.target.value)
        })
    }

    filterStudentSearch = (students, searchStr) => {
        searchStr = searchStr.toLowerCase();
        return students.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (student[attribute]) return student[attribute].toLowerCase().indexOf(searchStr) !== -1;
            });
        });
    }

    render() {
        return (
            <div>
                <div className="container" style={{ width: "85%", align: "center" }}>
                    <div style={{ alignContent: "center",marginBottom:"10px" }}><Paper component="form" style={{ padding: "2px 4px", display: "flex", alignItems: "center", width: "100%", alignContent: "center", border: "1px solid", borderRadius: "10px", backgroundColor: "#f0fffd" }}>
                        <InputBase
                            fullWidth
                            autofocus
                            margin="normal"
                            variant="outlined"
                            id="input-with-icon-adornment"
                            placeholder="Search Students by Name, School, Skills etc... "
                            inputProps={{ 'aria-label': 'search google maps' }}
                            label="Student Search"
                            style={{ width: "100%", height: "40px", paddingLeft: "20px", fontSize: "13px" }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon style={{ fontSize: "23px" }} />
                                </InputAdornment>
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={this.searchStudents}
                        />
                        <Divider orientation="vertical" />
                    </Paper></div>
                    {this.state.students.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(student => {
                        return (
                            <span style={{ padding: "0px" }}>
                                <Card style={{ backgroundColor: "rgb(202, 202, 202)", padding: "0px", margin: "4px" }}>
                                    <CardContent style={{ paddingBottom: "5px" }}>
                                        <Typography color="textSecondary" gutterBottom>
                                            <Link to={'/students/' + student.id}><b>{student.name.toUpperCase()}</b></Link>
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <SchoolIcon /> {student.college}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <LocationCityIcon /> {!student.city ? "-" : student.city}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <CakeIcon /> {!student.dob ? "-" : moment(student.dob).format("MMMM Do YYYY")}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <LocationOnIcon /> {(!student.city && !student.country) ? "-" : student.city + "," + student.country}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <AssignmentTurnedInIcon /> {!student.skills ? "-" : student.skills}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </span>
                        );
                    })}
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
            </div>
        )
    }
}

export default Students;