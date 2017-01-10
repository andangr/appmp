import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';

class NeedLoginDialog extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            showModal : false,
            loading: false,
            errors :''
        }
        
    }
    open() {
        this.setState({ showModal: true });
    }

    close() {
        this.setState({ showModal: false });
    }
    
    componentWillMount() {
        this.open();
	}
    
	render (){
        
		return (
                <Modal bsSize="small" aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Need login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row text-center">
                            <p>You have to login to access this request. </p>
                            <br/>
                        </div>
                        <div className="col-md-6">
                            <h4>Already have an account ?</h4>
                            <p>Please login by click this button </p>
                            <p class="text-center">
                                <a href=""><i class="fa fa-pencil big-icon"></i></a>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h4>Not a member?</h4>

                            <p>You can create an account:</p>

                            <p class="text-center">
                                <a href=""><i class="fa fa-sign-in big-icon"></i></a>
                            </p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
		)
	}
};

export default NeedLoginDialog;
