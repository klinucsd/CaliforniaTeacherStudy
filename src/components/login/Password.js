import React from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography/index';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from "axios";

const root_style = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
}

const title_style = {
    fontFamily: "'Google Sans','Noto Sans Myanmar UI',arial,sans-serif",
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: 1.3333,
    paddingTop: '20pt'
}

class Password extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            password: '',
            password_error_message: ''
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
            password_error_message: ''
        });
    };

    checkPassword = () => {

        let thisProps = this.props;
        let thisState = this;
        axios.post('/api/login', {
            params: {
                email: this.state.user.email,
                password: this.state.password
            }
        }).then(function (response) {
            //console.log(response.data);
            if (response.data !== null) {
                thisProps.set_authenticated(true);
                localStorage.setItem("user", JSON.stringify(thisState.state.user));
            } else {
                thisState.setState({
                    password_error_message: 'Wrong password.'
                });
            }
        }).catch(function (error) {
            console.log(error);
        }).then(function () {
            // always executed
        });

        /*
        if (this.state.password === this.state.user.password) {
            this.props.set_authenticated(true);
            localStorage.setItem("user", JSON.stringify(this.state.user));
        } else {
            this.setState({
                password_error_message: 'Wrong password.'
            });
        }
         */
    }

    keyPress = (e) => {
        if (e.keyCode === 13) {
            this.checkPassword();
        }
    }

    render() {
        return (
            <div style={root_style}>
                <Paper elevation={3} style={{width: '400px', height: '300px', textAlign: 'center'}}>
                    <div>
                        <Typography style={title_style}>
                            Hi {this.state.user.first_name}
                        </Typography>
                        <TextField
                            required
                            autoFocus
                            style={{marginTop: '20pt', width: '300px'}}
                            id="login_password"
                            label="Enter your password"
                            variant="outlined"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            onKeyDown={this.keyPress}
                            helperText={this.state.password_error_message}
                        />
                        <div style={{width: '100%', textAlign: 'right'}}>
                            <Button variant="contained"
                                    color="primary"
                                    onClick={() => this.checkPassword()}
                                    style={{margin: '40pt'}}>
                                Next
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }

}

export default Password;
