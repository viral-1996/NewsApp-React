import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GuardianNews.css';
import Badge from 'react-bootstrap/Badge';
import ShareModal from '../shareModal/shareModal';
import {NavLink, Link} from 'react-router-dom';
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

const override = css`
	padding-top: 50px;
	display: block;
	margin: 0 auto;
	border-color: red;
`;

class GuardianNews extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			newsArticles: [],
			isLoaded: false,
			error: null,
			toggle: ""
		}
	}

	handleClick = (event) => {
		event.preventDefault();
	}

	trimDescription(description){
		let ellipsis = 500;
		if(description.length < ellipsis)
			return description;
		while(description.charAt(ellipsis) !== " " && ellipsis > 0){
			ellipsis--;
		}
		return description.slice(0, ellipsis)+" ...";
	}

	category = ['sport', 'business', 'politics', 'world', 'technology'];
	categoryNY = ['sports', 'business', 'politics', 'world', 'technology'];
	curr = "";

	componentWillReceiveProps = (prevProps) => {
		console.log("will receive", this.props, prevProps);
		console.log("will prev", prevProps);
		console.log("will cur", this.props);
		var curr = this.props.match.params.category;
		var url = "";
		if(prevProps.news === false){
			url = `https://api.nytimes.com/svc/topstories/v2/${!this.curr?"home":this.curr}.json?api-key=nNDwcXTQUpD8tYWGwP3vzfCSjfM0vRgi`;
		}
		else{
			url = `https://content.guardianapis.com/search?api-key=39be595c-8df5-4058-babc-a20f7c80fe6c&section=${!this.curr?"(sport|business|technology|politics)":this.curr}&show-blocks=all`;
		}
		if(this.props.news != prevProps.news){
			this.fetchArticles(url);
		}
	}

	componentDidUpdate = (prevProps) => {
		this.curr = this.props.match.params.category;
		var url = "";
		if(this.props.news === true){
			url = `https://content.guardianapis.com/search?api-key=39be595c-8df5-4058-babc-a20f7c80fe6c&section=${!this.curr?"(sport|business|technology|politics)":this.curr}&show-blocks=all`;
			// url = `http://newsapp-backend.us-east-1.elasticbeanstalk.com/source/gd/section/${!this.curr?"home":this.curr}`;
		}
		else{
			url = `https://api.nytimes.com/svc/topstories/v2/${!this.curr?"home":this.curr}.json?api-key=nNDwcXTQUpD8tYWGwP3vzfCSjfM0vRgi`;
			// url = `http://newsapp-backend.us-east-1.elasticbeanstalk.com/source/ny/section/${!this.curr?"home":this.curr}`;
		}
		if(this.props.match.params.category != prevProps.match.params.category){
			this.fetchArticles(url);
		}
	}

	componentDidMount = () => {
		this.curr = this.props.match.params.category;
		var url = "";
		if(this.props.news === true){
			url = `https://content.guardianapis.com/search?api-key=39be595c-8df5-4058-babc-a20f7c80fe6c&section=${!this.curr?"(sport|business|technology|politics)":this.curr}&show-blocks=all`;
			// url = `http://newsapp-backend.us-east-1.elasticbeanstalk.com/source/gd/section/${!this.curr?"home":this.curr}`
		}
		else{
			url = `https://api.nytimes.com/svc/topstories/v2/${!this.curr?"home":this.curr}.json?api-key=nNDwcXTQUpD8tYWGwP3vzfCSjfM0vRgi`;
			// url = `http://newsapp-backend.us-east-1.elasticbeanstalk.com/source/ny/section/${!this.curr?"home":this.curr=="sport"?"sports":this.curr}`
			
		}
		this.fetchArticles(url);
	}

	fetchArticles = (url) => {
		console.log("fetching", url);
		this.setState({
			isLoaded: false,
		})
		fetch(url)
		.then(response => response.json())
		.then( (result) => {
				this.setState({
					isLoaded: true,
					newsArticles: result
				})
			},
			(error) => {
				this.setState({
					isLoaded: false,
					error
				})
			},
		)
	}

	fetchNYTimesImage = (article) => {
		if(article.multimedia){
			var i = 0;
			while( i< article.multimedia.length && article.multimedia[i].width < 2000)
				i++;
			if (i < article.multimedia.length)
				return article.multimedia[i].url;
		}
		return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
	}

	fetchGuardianImage = (newsArticle, key) => {
		if(newsArticle.blocks.main && newsArticle.blocks.main.elements[0].assets && newsArticle.blocks.main.elements[0].assets.length > 0){
			if(newsArticle.blocks.main.elements[0].assets[newsArticle.blocks.main.elements[0].assets.length-1].typeData.width > 2000)
				return newsArticle.blocks.main.elements[0].assets[newsArticle.blocks.main.elements[0].assets.length-1].file;
		}
		return "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
	}

	getPostId = (newsArticle) => {
		if(this.props.news)
			return '/post?gd='+newsArticle.id;
		else
			return '/post?ny='+newsArticle.url;
	}

	get_todays_date = (dt) => {
		var current_date = dt.getDate();
		var current_month = dt.getMonth() + 1;
		var current_year = dt.getFullYear();
		current_date = current_date < 10 ? '0' + current_date : current_date;
		current_month = current_month < 10 ? '0' + current_month : current_month;
		var current_datetime = current_year + '-' + current_month + '-' + current_date;
		return current_datetime.toString();
	}


	render() {
		const {error, isLoaded, newsArticles} = this.state;
		if(error){
		return <div>{console.log(error)}</div>
		}
		else if(!isLoaded){
			return (
				<div className="loading">
					<BounceLoader
						css={override}
						size={50}
						color={"#3f48cc"}
						loading={!isLoaded}
					/>
					Loading
				</div>
			)
		}
		else{
			if(this.props.news){
				return (
					<div className="news-container">
					{
						newsArticles.response.results.map( (newsArticle, key) => (
							<Link className="minimizedPage" to={this.getPostId(newsArticle)}>
								<div className="flex-grid-thirds news">
									<div className="col_img">
										<img src={this.fetchGuardianImage(newsArticle)}/>
									</div>
									<div className="col_text">
										<p><i><b>{newsArticle.webTitle}</b><span onClick={this.handleClick}>{<ShareModal title={newsArticle.webTitle} url={newsArticle.webUrl}/>}</span></i></p>
										<text>{this.trimDescription(newsArticle.blocks.body[0].bodyTextSummary)}</text>
										<div className="info">
											<div className="date"><i>{this.get_todays_date(new Date(newsArticle.webPublicationDate))}</i></div>
											<div className="badge"><text className="bade"><Badge variant="secondary" className={this.category.indexOf(newsArticle.sectionId) > -1 ? newsArticle.sectionId:"other"}>{this.category.indexOf(newsArticle.sectionId) > -1 ? newsArticle.sectionId.toUpperCase():"HEALTH"}</Badge>{' '}</text></div>
										</div>
									</div>
								</div>
							</Link>
						))
					}
				</div>
				);
			}
			else{
				newsArticles.results = newsArticles.results.slice(0,10);
				return (
					<div className="news-container">
							{
								newsArticles.results.map( (article, key) =>(
									<Link className="minimizedPage" to={this.getPostId(article)}>
										<div class="flex-grid-thirds">
											<div className="col_img">
												<img src={this.fetchNYTimesImage(article)} />
											</div>
											<div className="col_text">
												<p><i><b>{article.title}</b><span onClick={this.handleClick}>{<ShareModal title={article.title} url={article.url}/>}</span></i></p>
												<text>{this.trimDescription(article.abstract)}</text>
												<div className="info">
													<div className="date"><i>{this.get_todays_date(new Date(article.created_date))}</i></div>
													<div className="badge"><text className="bade"><Badge variant="secondary" className={this.categoryNY.indexOf(article.section)>-1?article.section:"other"}>{this.categoryNY.indexOf(article.section)>-1?article.section.toUpperCase():"HEALTH"}</Badge></text></div>
												</div>
											</div>
										</div>
									</Link>
								))
							}
					</div>
				)
			}
		}
}
}
export default GuardianNews;