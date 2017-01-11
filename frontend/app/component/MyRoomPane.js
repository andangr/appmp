import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import MyOrdersRow from './MyOrdersRow';
import TopUp from './TopUp';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class MyRoomPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "balance": {},
            "myorders": {}
        }
    }
    loadBalanceData(token){
		fetch(backend.url + `/api/getbalance`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(balance=>this.setState({balance}))
        
	}
	loadOrdersData(token){
		fetch(backend.url + `/api/myorders`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(myorders=>this.setState({myorders}))
        //http://172.19.16.127:8011/app_dev.php/api/getbalance
	}
    componentWillMount() {
            var token = cookie.load('token');
			this.loadOrdersData(token);
            this.loadBalanceData(token);
		
	}
    renderTable (key){
		return <MyOrdersRow details={this.state.myorders[key]} key={this.state.myorders[key].id} />
	}
	render (){
        console.log(this.state);
		return (
             <div className="col-lg-12">
                <div className="ibox float-e-margins">
                    <div className="ibox-title text-center">
                        <h3><i className="fa fa-cart-arrow-down"></i> My Order List </h3>
                        <hr/>
                    </div>
                    <div className="ibox-content">
                        <div className="row">
                           <div className="col-sm-6">
                                <TopUp />
                            </div>
                            
                            
                        </div>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>

                                    <th></th>
                                    <th>ID</th>
                                    <th>Product Purchased</th>
                                    <th>Price</th>
                                    <th>Payment Method</th>
                                    <th>Date Purchased</th>
                                    <th>Times Downloaded</th>
                                    <th>Payment Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(this.state.myorders).map(this.renderTable)}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
		)
	}
};

export default MyRoomPane;
