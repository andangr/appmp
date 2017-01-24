import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';

import Options from '../helper/Options';
import backend from '../../configs/backend';

import 'sweetalert/dist/sweetalert.css';

class UserEdit extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            user: {
                id: '',
                name: '',
                email: '',
                role: '',
                password: ''
            },
            roles: [
                {
                    value: 'ROLE_USER',
                    text: 'User'
                },
                {
                    value: 'ROLE_ADMIN',
                    text: 'Admin'
                }
            ],
            swal: {
                show: false,
                title: '',
                message: '',
                type: 'info',
                confirm_button: true,
            },
            showModal: false,
        };

        this.validatorTypes = strategy.createSchema(
            {
                email: 'required|email',
                name: 'required',
                role: 'required',
            },
            {

            }
        );
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    componentWillMount() {
        this.setState({
            user: this.props.user
        });
        console.log(this.props.user);
    }

    _submitHandler(e) {
        e.preventDefault();
        console.log(this.state.user);
        this.props.validate(error => {
            if (!error) {
                this.updateUser();
            }
        });

    }

    updateUser() {
        this.setState({
            swal: {
                show: true,
                title: 'Please wait...',
                text: 'We are saving your data',
                type: 'info',
                confirm_button: false,
            }
        });
        var token = cookie.load('token');
        axios.create({
            baseURL: backend.url,
            timeout: 1000,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).put('/api/users/'+this.state.user.id, this.state.user).then(response => {
            let swal = this.state.swal;
            if (response.data.error) {
                swal.title = 'Gagal';
                swal.type = 'error';
            } else {
                swal.title = 'Berhasil';
                swal.type = 'success';
                swal.confirm_button = true;
            }
            swal.text = response.data.message;
            this.setState({ swal: swal });
            if (!response.data.error)
                location.reload();
        }).catch(error => {
            let swal = this.state.swal;

            swal.confirm_button = true;
            swal.title = 'Gagal';
            swal.type = 'error';
            swal.text = 'Please check your connection';
            this.setState({ swal: swal });
            console.log(error);
        });
    }

    _onChange(e) {
        let newUser = this.state.user;
        newUser[e.target.name] = $.trim(e.target.value);
        this.setState({ user: newUser });

        this.props.handleValidation(e.target.name)(e);
    }

    getValidatorData() {
        return this.state.user;
    }

    getClassName(field) {
        return this.props.isValid(field) ? '' : 'has-error';
    }

    renderErrors(messages) {
        if (messages.length) {
            messages = messages.map((message, i) => <li key={i} className="">{message}</li>);
            return <ul className="errors">{messages}</ul>;
        }
    }

    renderRoleOption(key) {
        return <Options id={this.state.roles[key].value} text={this.state.roles[key].text} key={this.state.roles[key].value} />;
    }

    activateValidation(e) {
        strategy.activateRule(this.validatorTypes, e.target.name);
        this.props.handleValidation(e.target.name)(e);
    }

    dismissSwal() {
        let swal = this.state.swal;
        swal.show = false;
        this.setState({ swal: swal });
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <a className=" pull-right"
                        onClick={this.open} >
                        <i className="fa fa-pencil"></i></a>
                </div>
                <Modal aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row text-center">
                            <h3>Edit User Detail</h3>
                            <br />
                        </div>
                        <form role="form" className="css-form" >

                            <div className="col-lg-12"  >
                                <div className={this.getClassName('name') + ' form-group'}>
                                    <label className="  control-label">Full Name </label>
                                    <div>
                                        <input type="text" name="name"
                                        value={this.state.user.name} onChange={this._onChange}
                                            placeholder="Full Name" className="form-control" />
                                        {this.renderErrors(this.props.getValidationMessages('name'))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12"  >
                                <div className={this.getClassName('password') + ' form-group'}>
                                    <label className="  control-label">Password </label>
                                    <div>
                                        <input type="password" name="password" onChange={this._onChange}
                                            placeholder="Leave it empty if you don't want to change password" className="form-control" />
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6"  >
                                <div className={this.getClassName('email') + ' form-group'}>
                                    <label className="  control-label">Email </label>
                                    <div>
                                        <input type="email" name="email" onChange={this._onChange}
                                        value={this.state.user.email}
                                            placeholder="name@gmail.com" className="form-control" />
                                        {this.renderErrors(this.props.getValidationMessages('email'))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6"  >
                                <div className={this.getClassName('role') + ' form-group'}>
                                    <label className=" control-label">Role </label>
                                    <select className="form-control" name="role"
                                        value={this.state.user.role}
                                        onChange={this._onChange}
                                        onBlur={this.props.handleValidation('role')} >
                                        <option value='' disabled  >Select a role</option>
                                        {Object.keys(this.state.roles).map(this.renderRoleOption)}
                                    </select>
                                </div>
                            </div>
                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={(e) => this._submitHandler(e)} bsStyle="success">
                            Save
                        </Button>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <SweetAlert
                    show={this.state.swal.show}
                    title={this.state.swal.title}
                    text={this.state.swal.text}
                    type={this.state.swal.type}
                    showConfirmButton={this.state.swal.confirm_button}
                    onConfirm={this.dismissSwal}
                    onOutsideClick={this.dismissSwal}
                    />
            </div>
        );
    }
}

UserEdit = validation(strategy)(UserEdit);

export default UserEdit;
