import React from 'react';
import autoBind from 'react-autobind';

import SearchCategory from './SearchCategory';
import SearchResult from './SearchResult';

import axios from 'axios';
import backend from '../../configs/backend';

class SearchPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            category_id: '',
            keywords: '',
            productList: []
        };
    }

    doSearch(e) {
        e.preventDefault();
        let cat_id = this.state.category_id;
        let keywords = this.state.keywords;
        if (keywords === '' || cat_id === '') return;
        axios({
            method: 'get',
            url: backend.url + '/api/search?category_id=' + cat_id + '&keywords=' + keywords,
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            this.setState({
                productList: response.data
            });
        });
    }

    categoryChanged(cat_id) {
        this.setState({
            category_id: cat_id
        });
        console.log(cat_id);
    }

    keywordChanged() {
        this.setState({
            keywords: document.getElementById('keywords').value
        });
    }



    render() {
        return (
            <div style={{ padding: 10 + 'px' }}>
                <form className="form-inline" onSubmit={this.doSearch}>
                    <div className="form-group">
                        <label>Kategori &nbsp;</label>
                        <SearchCategory changeHandler={this.categoryChanged} />
                    </div>
                    <div className="form-group">
                        <label >&nbsp; Keyword &nbsp;</label>
                        <input type="text" className="form-control" name="keyword" id="keywords" onKeyUp={this.keywordChanged} />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-default" onClick={this.doSearch} >Search</button>
                    </div>
                </form>
                <hr></hr>
                <h4>Search Result : </h4>
                <SearchResult products={this.state.productList} />
            </div>
        );
    }
}

export default SearchPane;