import React from "react";
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, withRouter, Switch as SwitchRouter, Route, BrowserRouter as Router, useParams } from 'react-router-dom';
import CustomNavbar from '../components/customNavbar/customNavbar.js';
import Post from './Post';
import Bookmarks from './Bookmarks';
import GuardianNews from "../components/Guardian/GuardianNews";
import SearchResult from '../components/SearchResult/SearchResult';

class Home extends React.Component{
	constructor(props, prevProps){
		super(props);
		if(!localStorage.getItem("bookmarks"))
			localStorage.setItem("bookmarks", JSON.stringify({bookmark:[]}) );
		this.state = {
			source: localStorage.getItem('toggleState')?(localStorage.getItem('toggleState')=="guardian"?true:false):true,
			error: null,
			suggestion: [],
			inputValue: ''
		}
	}

	getNewsSource = (source) => {
		// console.log("callback", source);
		this.setState({source},
			() => console.log());
	}

	render(){
		return (
			<div>
				<CustomNavbar callback = {this.getNewsSource}/>
				<SwitchRouter>
					<Route exact strict path="/post"  component={Post} />
					<Route exact strict path="/bookmarks" component={Bookmarks} />
					{/* <Route exact strict path="/search" component={SearchResult}/> */}
					<Route exact strict path="/search" render={(props) => <SearchResult {...props} news={this.state.source}/> } />
					<Route exact strict path="/" render={(props) => <GuardianNews {...props} news={this.state.source}/> } />
					<Route exact strict path="/:category" render={(props) => <GuardianNews {...props} news={this.state.source}/> } />
					{/* <Route exact strict path="/" component={GuardianNews} /> */}
					{/* <Route exact strict path="/:category" component={GuardianNews} /> */}
				</SwitchRouter>
			</div>
	);
}
};

// render(<App />, document.getElementById("root"));

export default withRouter(Home);