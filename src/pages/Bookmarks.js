import React from 'react';
import Badge from 'react-bootstrap/Badge';
import ShareModal from '../components/shareModal/shareModal';
import {Link} from 'react-router-dom';
import {FaTrash} from 'react-icons/fa';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './bookmark.css';

class Bookmarks extends React.Component {
	constructor(props){
		super(props);
	}

	getPostId = (newsArticle) => {
		console.log("getting id",newsArticle);
		if(newsArticle.type=="ny"){
			// console.log("/post?ny="+newsArticle.article_url);
			return "/post?ny="+newsArticle.id;
		}
		else{
			return "/post?gd="+newsArticle.id;
		}
	}

	category = ['sport', 'business', 'politics', 'world', 'technology', 'sports', 'gd', 'ny'];

	get_todays_date = (dt) => {
		var current_date = dt.getDate();
		var current_month = dt.getMonth() + 1;
		var current_year = dt.getFullYear();

		// Add 0 before date, month, hrs, mins or secs if they are less than 0
		current_date = current_date < 10 ? '0' + current_date : current_date;
		current_month = current_month < 10 ? '0' + current_month : current_month;
		var current_datetime = current_year + '-' + current_month + '-' + current_date;
		return current_datetime.toString();
	}

	checkArticleInBookmark = (bookmarks) => {
		for(var i=0;i<bookmarks.length;i++){
			if(bookmarks[i].id == this.props.id)
				return i;
		}
		return false;
	}

	handleClick = (event) =>{
		event.preventDefault();
	}

	removeBookmark = id => (event) => {
		event.preventDefault();
		// event.stopPropagation();
		// console.log("here");
		// console.log(id);
		// this.notify(id);
		// this.notify(id);
		var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
		for(var i=0;i<bookmarks.bookmark.length;i++){
			if(bookmarks.bookmark[i].id == id)
				break;
		}
		toast("Removing from Bookmarks: "+bookmarks.bookmark[i].title, {
			className: 'toast_text'
		});
		bookmarks.bookmark.splice(i,1);
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
		// setTimeout(function())
		// this.forceUpdate();
		setTimeout(() => {this.forceUpdate()}, 1000);
	}

	render() {
		var articleList = JSON.parse(localStorage.getItem("bookmarks"));
		console.log(articleList);
		if(articleList.bookmark.length == 0){
			return <div className="no_articles">You have no Saved Articles</div>
		}
		// console.log(articleList);
		
		return (
			<div className="bookmark_page">
				<p className="bookmark_header">Favorites</p>
				<div className="container_search">
					{
						articleList.bookmark.map( (article) => (
							<div className="item_search">
								<Link className="searchCards" to={this.getPostId(article)}>
									<p>
										<b><i>{article.title}</i></b>&nbsp;&nbsp;&nbsp;
										<span onClick={this.handleClick}>{<ShareModal title={article.title} url={article.url}/>}</span>&nbsp;
										<span onClick={this.removeBookmark(article.id)}>
											<span >
												<FaTrash />
												<ToastContainer 
													position="top-center"
													autoClose={2000}
													hideProgressBar
													transition={Zoom}
													newestOnTop={false}
													closeOnClick={false}
													rtl={false}
													pauseOnVisibilityChange={false}
													draggable={false}
													pauseOnHover={false}
												/>
											</span>
										</span>
									</p>
									<img src={article.image} />
									<div className="date_badge">
										{this.get_todays_date(new Date(article.date))}
										<div class="badgeicons">
											<Badge variant="secondary" className={article.type}>{article.type=="gd"?"GUARDIAN":"NYTIMES"}</Badge>{' '}
											<Badge variant="secondary" className={this.category.indexOf(article.section.toLowerCase()) > -1 ? article.section.toLowerCase():"other"}>{article.section.toUpperCase()}</Badge>{' '}
										</div>
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

export default Bookmarks;