import React from 'react';
import CustomNavBar from "../components/customNavbar/customNavbar.js";
import ShareModal from '../components/shareModal/shareModal.js';
import {FaChevronDown} from 'react-icons/fa';
import ExpanedCard from '../components/ExpandedCard/ExpandedCard.js';
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";


const override = css` padding-top: 50px; display: block; margin: 0 auto; border-color: red;`;

class Post extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isLoaded: false,
			error: null,
			article: "",
			sourceType: ""
		}
	}

	componentDidMount = () => {
		let article_id = this.props.location.search;
		var sourceType = article_id.slice(1, 3);
		this.setState({sourceType},console.log())
		article_id = article_id.slice(4);
		var url="";
		if(sourceType == "gd"){
			url = `https://content.guardianapis.com/${article_id}?api-key=39be595c-8df5-4058-babc-a20f7c80fe6c&show-blocks=all`;
		}
		else{
			url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(%22'+article_id+'%22)&api-key=nNDwcXTQUpD8tYWGwP3vzfCSjfM0vRgi';
		}
		console.log("fetching", url);
		fetch(url)
		.then(response =>  response.json())
		.then( (result) => {
				this.setState({
					isLoaded: true,
					article: result
				})
			},
			(error) => {
				this.setState({
					isLoaded:false,
					error
				})
			},
		)
	}

	getTrimChar = (description) => {
		let ellipsis = 1500;
		console.log("trimming description", description.length);
		if(description.length < ellipsis){
			return description.length;
		}
		while(ellipsis >= 0 && description.charAt(ellipsis) != "."){
			console.log(ellipsis);
			ellipsis --;
		}
		
		return ellipsis++;
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

	fetchNYTimesImage = (article) => {
		if(article.multimedia){
			var i = 0;
			while( i < article.multimedia.length && article.multimedia[i].width < 2000)
				i++;
			if (i< article.multimedia.length)
				return article.multimedia[i].url;
		}
		return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
	}

	fetchGuardianImage = (newsArticle) => {
		if(newsArticle.blocks.main && newsArticle.blocks.main.elements[0].assets && newsArticle.blocks.main.elements[0].assets.length > 0){
			if(newsArticle.blocks.main.elements[0].assets[newsArticle.blocks.main.elements[0].assets.length-1].typeData.width > 2000)
				return newsArticle.blocks.main.elements[0].assets[newsArticle.blocks.main.elements[0].assets.length-1].file;
		}
		return "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
	}

	render() {
		const {error, isLoaded, article, sourceType} = this.state;
		if(error){
			return <div>Error</div>
		}
		else if(!isLoaded){
			return (
				// <div>Loading ...</div>
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
			var flag = 1;
			var ellipsis = 800;
			var description = "";
			var description_2 = "";
			var d, title, image, article_url, section;
			if(sourceType == "gd"){
				var artcle = article.response.content;
				description = artcle.blocks.body[0].bodyTextSummary;
				d = new Date(artcle.webPublicationDate)
				title = artcle.webTitle;
				image = this.fetchGuardianImage(artcle);
				article_url = artcle.webUrl;
				section = artcle.sectionId;
			}
			else{
				description = article.response.docs[0].abstract;
				d = new Date(article.response.docs[0].pub_date);
				title = article.response.docs[0].headline.main;
				image = this.fetchNYTimesImage(article.response.docs[0]).startsWith("http")?this.fetchNYTimesImage(article.response.docs[0]):"http://nytimes.com/"+this.fetchNYTimesImage(article.response.docs[0]);
				article_url = article.response.docs[0].web_url;
				section = article.response.docs[0].news_desk;
			}
			description = description.trim();
			var sentences = description.split(".");
			if(description.length < ellipsis)
				flag = 0;
			if(flag){
				while(ellipsis > 0 && description.charAt(ellipsis) != " ")
					ellipsis --;
				description_2 = description.slice(ellipsis);
				description = description.slice(0, ellipsis);
			}
			var dateString = this.get_todays_date(d);
			console.log(dateString);
			return (
				<div className="expanded_article">
					<ExpanedCard type={sourceType} dte={d} section={section} id={this.props.location.search.slice(4)} articleDate={dateString} display_flag={flag} article_image={image} article_title={title} description={description} url={article_url}>
						<div>
							{description_2}
						</div>
					</ExpanedCard>
				</div>
			);
		}
	}
}

export default Post;