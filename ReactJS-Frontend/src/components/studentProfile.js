import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../App.css';
import axios from 'axios';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';

class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: [],
            page: 0,
            rowsPerPage: 25
        }
    }
    componentDidMount() {
        const { match: { params } } = this.props;
        let url = 'http://localhost:8080/students?id=' + params.id;
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        student: response.data[0]
                    })
                } else {
                    this.setState({
                        student: {}
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    student: {}
                })
            });
    }
    render() {
        let name = '\'' + this.state.student.name + '\'';
        return (
            <div>
                <Avatar>{name.substring(1, 2)}</Avatar> {this.state.student.name}
            </div>
        )
    }
}

export default StudentProfile;