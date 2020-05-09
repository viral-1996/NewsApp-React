import React from "react";
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter, Switch, Route, BrowserRouter as Router, useParams } from 'react-router-dom';
import Home from './pages/Home';

class App extends React.Component{
	constructor(props){
		super(props);
		console.log("App", props);
	}

	render(){
		return (
			<div>
				<Home/>
			</div>
	);
}
};

// render(<App />, document.getElementById("root"));

export default withRouter(App);