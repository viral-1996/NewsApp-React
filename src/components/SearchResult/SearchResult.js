import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchResult.css';
import Badge from 'react-bootstrap/Badge';
import ShareModal from '../shareModal/shareModal';
import {Link} from 'react-router-dom';
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

const override = css`
	padding-top: 50px;
	display: block;
	margin: 0 auto;
	border-color: red;
`;


class SearchResult extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			articles: [],
			isLoaded: false,
			error: null,
			sourceType: ""
		}
	}

	getPostId = (newsArticle) => {
		console.log("getting id",newsArticle);
		console.log(this.state.sourceType);
		if(this.state.sourceType=="ny"){
			console.log("/post?ny="+newsArticle.article_url);
			return "/post?ny="+newsArticle.article_url;
		}
		else{
			return "/post?gd="+newsArticle.id;
		}
	}

	componentDidUpdate = (prevProps) => {
		var sourceType = this.state.sourceType;
		var searchUrl = "";
		if(prevProps.location.search != this.props.location.search){
			var query = this.props.location.search.slice(4);
			// var searchUrl = `http://newsapp-backend.us-east-1.elasticbeanstalk.com/source/${sourceType}/search?q=${query}`;
			if(sourceType=="gd")
				searchUrl = `https://content.guardianapis.com/search?q=${query}&api-key=39be595c-8df5-4058-babc-a20f7c80fe6c&show-blocks=all`;
			else
				searchUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=nNDwcXTQUpD8tYWGwP3vzfCSjfM0vRgi`;
			this.fetchArticles(searchUrl);
		}
	}

	componentDidMount = () => {
		var sourceType = this.props.location.search.slice(1,3);
		this.setState({sourceType}, console.log());
		console.log(this.props.location.search);
		var query = this.props.location.search.slice(4);
		var searchUrl = "";
		// var searchUrl = `http://newsapp-backend.us-east-1.elasticbeanstalk.com/source/${sourceType}/search?q=${query}`;
		if(sourceType=="gd")
				searchUrl = `https://content.guardianapis.com/search?q=${query}&api-key=39be595c-8df5-4058-babc-a20f7c80fe6c&show-blocks=all`;
		else
			searchUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=nNDwcXTQUpD8tYWGwP3vzfCSjfM0vRgi`;	
		this.fetchArticles(searchUrl);
		
	}

	fetchArticles = (url) => {
		console.log("fetching", url);
		this.setState({
			isLoaded: false
		})
		fetch(url)
		.then(response => response.json())
		.then( (result) => {
				this.setState({
					isLoaded: true,
					articles: result
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

	get_todays_date = (dt) => {
		var current_date = dt.getDate();
		var current_month = dt.getMonth() + 1;
		var current_year = dt.getFullYear();
		current_date = current_date < 10 ? '0' + current_date : current_date;
		current_month = current_month < 10 ? '0' + current_month : current_month;
		var current_datetime = current_year + '-' + current_month + '-' + current_date;
		return current_datetime.toString();
	}

	fetchImage = (newsArticle, key) => {
		// console.log(key);
		if(newsArticle.blocks.main && newsArticle.blocks.main.elements[0].assets && newsArticle.blocks.main.elements[0].assets.length > 0){
			return newsArticle.blocks.main.elements[0].assets[newsArticle.blocks.main.elements[0].assets.length-1].file;
		}
		return "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
	}

	handleClick = (event) =>{
		event.preventDefault();
	}

	category = ['sport', 'business', 'politics', 'world', 'technology'];
	categoryNY = ['sports', 'business', 'politics', 'world', 'technology'];

	render () {
		const {error, isLoaded, articles} = this.state;
		if(error){
			return <div>Error</div>
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
			if(this.state.sourceType == "gd"){
				if(articles.response.results.length == 0){
					return <div className="no_articles">No Articles Found</div>
				}
				var artcle = articles.response.results;
				return(
					<div className="bookmark_page">
						<p className="bookmark_header"> Search Results</p>
						<div className="container_search">
						{
							artcle.map( (article) => (
								<div className="item_search">
									<Link className="searchCards" to={this.getPostId(article)}>
										<p>
											<b>{article.webTitle}</b>
											<span onClick={this.handleClick}>{<ShareModal title={article.webTitle} url={article.webUrl}/>}</span>
										</p>
										<img src={this.fetchImage(article)}/>
										<div className="date_badge">
											{this.get_todays_date(new Date(article.webPublicationDate))}
											<Badge pill variant="success" className={this.category.indexOf(article.sectionId) > -1 ? article.sectionId:"other"}>{article.sectionId.toUpperCase()}</Badge>{' '}
										</div>
									</Link>
								</div>
							))
						}
						</div>
					</div>
				)
			}
			else{
				var temp1 = articles.response.docs;
				var artcles = [];
				for(var i=0;i<temp1.length;i++){
					var t = {};    
					var images = temp1[i].multimedia;
					var flag = 1;
					if(images.length<0)
						flag = 0;
					else{
						var j=0;
						for(j=0;j<images.length;j++){
							if(images[j].width>2000){
								flag = 0;
								break;
							}
						}
						if(j==images.length)
							continue;
					}
					if(flag)
						t['url'] = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
					else
						t['url'] = 'http://www.nytimes.com/'+images[j].url;
					t['description'] = temp1[i].abstract;
					t['title'] = temp1[i].headline.main;
					t['article_url'] = temp1[i].web_url;
					t['pub_date'] = temp1[i].pub_date;
					t['section'] = temp1[i].news_desk;
					artcles.push(t);
				}
				console.log("filtered", artcles);
				if(artcles.length == 0){
					return <div className="no_articles">No Articles Found</div>
				}
				return(
					<div className="bookmark_page">
						<p className="bookmark_header"> Search Results</p>
						<div className="container_search">
							
							{
								artcles.map( (article) => (	
									<div className="item_search">
										<Link className="minimizedPage" to={this.getPostId(article)}>
											<p>
												<b>{article.title}</b>
												<span onClick={this.handleClick}>{<ShareModal title={article.title} url={article.article_url}/>}</span>
											</p>
											<img src={article.url} />
											<div className="date_badge">
												{this.get_todays_date(new Date(article.pub_date))}
												<Badge pill variant="success" className={this.categoryNY.indexOf(article.section.toLowerCase()) > -1 ? article.section.toLowerCase():"other"}>{article.section.toUpperCase()}</Badge>{' '}
											</div>
										</Link>
									</div>
								))
							}
						</div>
					</div>
				)
			}
		}
	}
}

export default SearchResult;