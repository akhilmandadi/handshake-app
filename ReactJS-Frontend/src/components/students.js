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

class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            page: 0,
            rowsPerPage: 25
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    }
    componentDidMount() {
        let url = 'http://localhost:8080/students';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        students: response.data
                    })
                } else {
                    this.setState({
                        students: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    students: []
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
    render() {

        return (
            <div>
                <div className="container" style={{ width: "85%", align: "center" }}>
                    {this.state.students.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(student => {
                        return (
                            <span style={{ padding: "0px" }}>
                                <Card style={{ backgroundColor: "rgb(202, 202, 202)", padding: "0px", margin: "4px" }}>
                                    <CardContent style={{ paddingBottom: "5px"}}>
                                        <Typography color="textSecondary" gutterBottom>
                                        <Link to={'/students/'+student.id}><b>{student.name.toUpperCase()}</b></Link>
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <SchoolIcon /> {student.college}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <LocationCityIcon /> {!student.city ? "-" : student.city}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <CakeIcon /> {!student.dob ? "-" : student.dob}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <LocationOnIcon /> {(!student.city && !student.country) ? "-" : student.city + "," + student.country}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            <AssignmentTurnedInIcon /> {!student.skills ? "-" : student.skills}
                                        </Typography>
                                    </CardContent>
                                    
                                </Card></span>
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