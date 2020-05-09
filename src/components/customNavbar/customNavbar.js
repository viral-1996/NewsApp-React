import React from 'react';
import './customNavbar.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Switch from 'react-switch';
import {MdBookmarkBorder, MdBookmark} from 'react-icons/md';
import { IconContext } from "react-icons";
import { Route, Link, BrowserRouter as Router, Switch  as SwitchRouter, useParams, withRouter} from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import {debounce} from 'lodash';
import ReactTooltip from 'react-tooltip';

class CustomNavbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: localStorage.getItem("toggleState")?(localStorage.getItem("toggleState")=="guardian"?true:false):true,
			error: null,
			suggestion: [],
			inputValue: ''
		}
	}

	handleChange = (checked) => {
		localStorage.setItem('toggleState',(checked?"guardian":"nytimes"));
		this.setState({ checked }, ()=>console.log());
		this.props.callback(checked);
	}

	async filterSuggestion(inputValue){
		var url = "https://viral-1996.cognitiveservices.azure.com/bing/v7.0/suggestions?q=";
		const response = await fetch(url+inputValue,{
			method: 'get',
			headers: new Headers({
				'Ocp-Apim-Subscription-Key': '5bdb5b854c554536a01239e933ffe3dc'
			})
		})
		const json = await response.json();
		let options = [{
			value: inputValue,
			label: inputValue
		}]
		let suggestions = json.suggestionGroups[0].searchSuggestions;
		suggestions.map((item, key) =>{
			options.push({
					value: item.displayText,
					label: item.displayText		
				})
			}	
		)
		return options;
	}

	displaySwitch = () =>{
		if(window.location.href.includes('/search'))
			return false;
		if(window.location.href.includes('/post'))
			return false;
		if(window.location.href.includes('/bookmark'))
			return false;
		return true;
	}

	bookmarkColor = () => {
		if(window.location.href.includes('/bookmark'))
			return true;
		return false;
	}

	handleInputChange = (newValue) => {
		const inputValue = newValue;
		this.setState({inputValue});
		console.log(inputValue);
		return inputValue;
	};

	getSearchValue = (query) => {
		this.setState ({
			inputValue: query.value},
			() => {
			this.props.history.push(`/search?${this.state.checked?"gd":"ny"}=`+query.value);
		})
	}

	getActiveClass = (currPage) => {
		if(this.props.location.pathname == currPage)
			return true;
		return false;
	}

	render() {
		return (
				<div>
					<Navbar collapseOnSelect expand="lg" variant="dark">
						<AsyncSelect
							loadOptions = {debounce(this.filterSuggestion, 1000, {leading:true})}
							onInputChange = {this.handleInputChange}
							noOptionsMessage = {() => "No Match"}
							onChange = {this.getSearchValue}
							placeholder = "Enter Keyword ..."
						/>
						<Navbar.Toggle aria-controls="responsive-navbar-nav" />
						<Navbar.Collapse id="responsive-navbar-nav">
							<Nav className="mr-auto">
								<Nav.Link><Link className={this.getActiveClass("/")?"active":""} to="/">Home</Link></Nav.Link>
								<Nav.Link><Link className={this.getActiveClass("/world")?"active":""} to="/world">World</Link></Nav.Link>
								<Nav.Link><Link className={this.getActiveClass("/politics")?"active":""} to="/politics">Politics</Link></Nav.Link>
								<Nav.Link><Link className={this.getActiveClass("/business")?"active":""} to="/business">Business</Link></Nav.Link>
								<Nav.Link><Link className={this.getActiveClass("/technology")?"active":""} to="/technology">Technology</Link></Nav.Link>
								<Nav.Link><Link className={this.getActiveClass("/sport")?"active":""} to="/sport">Sports</Link></Nav.Link>
							</Nav>
							<Nav>
								<Nav.Link href={this.bookmarkColor()?"/":"/bookmarks"}>
									<div data-tip="bookmarks">
									{
										this.bookmarkColor()?
										<IconContext.Provider value={{ color: "white" }}>
											<MdBookmark size={20} className="bookmark-icon"/>
										</IconContext.Provider>
										:
										<IconContext.Provider value={{ color: "white" }}>
											<MdBookmarkBorder size={20} className="bookmark-icon"/>
										</IconContext.Provider>
									}
									</div>
									<ReactTooltip className="tooltip" place="bottom" type="dark" effect="solid"/>
								</Nav.Link>
							</Nav>
							{
								this.displaySwitch()?	
									<Nav className="right">
										<Nav.Link>NY Times</Nav.Link>
										<label htmlFor="material-switch">
											<Switch
												checked={this.state.checked}
												onChange={this.handleChange}
												onColor="#038EFA"
												onHandleColor="#fff"
												handleDiameter={20}
												uncheckedIcon={false}
												checkedIcon={false}
												boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
												activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
												height={22}
												width={40}
												className="react-switch"
												id="material-switch"
											/>
										</label>
										<Nav.Link>Guardian</Nav.Link>
									</Nav>
									:null
							}
						</Navbar.Collapse>
					</Navbar>
				</div>
		)
	}
}

export default withRouter(CustomNavbar);