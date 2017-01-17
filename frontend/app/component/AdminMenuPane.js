import React from 'react';
import autoBind from 'react-autobind';

import { Link } from 'react-router';

class AdminMenuPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }
    render() {
        return (
            <nav className="navbar-default navbar-static-side" role="navigation">
                <div className="sidebar-collapse">

                    <ul className="nav metismenu" id="side-menu">
                        <li >
                            <Link to={'/createproduct'} ><i className="fa fa-diamond"></i> <span className="nav-label">Products</span> </Link>
                        </li>
                        <li>
                            <Link to={'/vouchermg'} ><i className="fa fa-shopping-cart"></i> <span className="nav-label">Voucher Management</span> </Link>
                        </li>
                    </ul>

                </div>
            </nav>

        );
    }
}

export default AdminMenuPane;