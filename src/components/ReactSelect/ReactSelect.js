import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';
import './ReactSelect.css'
import {debounce} from 'lodash';
import {NavLink, Link} from 'react-router-dom';

const url = "https://viral-1996.cognitiveservices.azure.com/bing/v7.0/suggestions?q=";

class ReactSelect extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			error: null,
			suggestion: [],
			isLoaded: false,
			inputValue: ''
		};
	}

	async filterSuggestion(inputValue){
		// console.log("idhar", inputValue);
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
		// console.log(suggestions);
		suggestions.map((item, key) =>{
			options.push(
				{
					value: item.displayText,
					label: item.displayText		
				}
			)
			}	
		)
		console.log(options);
		// sugg = [{value:"abc", label:"abc"}]
		// this.setState({suggestion:suggestions});
		return options;
	}


	handleInputChange = (newValue) => {
		// const inputValue = newValue.replace(/\W/g, '');
		const inputValue = newValue;
		this.setState({inputValue});
		// console.log(inputValue);
		return inputValue;
	};

	getSearchValue = (query) => {
		console.log(query.value);
		console.log("history",this.props);
		this.setState ({
			inputValue: query.value},
			() => {
			this.props.history.push('/search?q'+query.value);
		})
		// return "/search?query="+this.state.inputValue;
	}

	render(){
		return(
			<div>
				<AsyncSelect
					value = {this.state.inputValue}
					placeholder = "Enter Keyword ..."
					loadOptions = {this.filterSuggestion}
					onInputChange = {this.handleInputChange}
					onChange = {this.getSearchValue}
				/>
			</div>
		)
	}
}

export default ReactSelect;