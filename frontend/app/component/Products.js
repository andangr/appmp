import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import autoBind from 'react-autobind';
import { Link } from 'react-router';

class Product extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    
	render () {
		//console.log(this.props.details.images[0].image_url); 'http://placehold.it/800x500'
		return (
            <div className="col-md-3 col-sm-6 hero-feature">
                <div className="thumbnail">
                    <img src={this.props.details.images[0].image_url} alt=""  className="img-responsive" />
                    <div className="caption">
                        <h3>{this.props.name}</h3>
                        <p>{this.props.details.description}</p>
                        <p>
                            
                            <Link to={'/buy/'+ + encodeURIComponent(this.props.details.id)} className="btn btn-info pull-bottom">Buy Now!</Link>
                            <Link to={'/details/'+ + encodeURIComponent(this.props.details.id)} className="btn btn-default pull-bottom">More Info</Link>
                        </p>
                    </div>
                </div>
            </div>
			
		);
	}
};

                        
export default Product;
/*
*/