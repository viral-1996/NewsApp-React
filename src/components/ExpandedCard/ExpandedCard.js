import React, { Component } from "react";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from 'react-icons/md';
import './ExpandedCard.css';
import {EmailShareButton,FacebookShareButton,TwitterShareButton, FacebookIcon, TwitterIcon, EmailIcon} from "react-share";
import {MdBookmarkBorder, MdBookmark} from 'react-icons/md';
import { IconContext } from "react-icons";
import commentBox from 'commentbox.io';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip';

class ExpandedCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			opened: false,
		};
		this.toggleBox = this.toggleBox.bind(this);
	}

	checkArticleInBookmark = () => {
		var bookmarks = JSON.parse(localStorage.getItem("bookmarks")).bookmark;
		for(var i=0;i<bookmarks.length;i++){
			if(bookmarks[i].id == this.props.id)
				return i;
		}
		return false;
	}

	notify = (event) => {
		event.preventDefault();
		var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
		var flag = this.checkArticleInBookmark();
		if(flag === false){
			var articleDetails = {};
			articleDetails['id'] = this.props.id;
			articleDetails['type'] = this.props.type;
			articleDetails['image'] = this.props.article_image;
			articleDetails['title'] = this.props.article_title;
			articleDetails['description'] = this.props.description;
			articleDetails['display_flag'] = this.props.display_flag;
			articleDetails['url'] = this.props.url;
			articleDetails['date'] = this.props.dte;
			articleDetails['section'] = this.props.section;
			bookmarks.bookmark.push(articleDetails);
			toast("Saving: "+this.props.article_title, {
				className: 'toast_text'
			});
		}
		else{
			bookmarks.bookmark.splice(flag, 1);
			toast("Removing from Bookmarks: "+this.props.article_title, {
				className: 'toast_text'
			});
		}
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
		this.forceUpdate();
	}

	toggleBox() {
		const { opened } = this.state;
		this.setState({
			opened: !opened,
		});
	}

	componentDidMount = () => {
		// var id = this.props.id;
		console.log("here did mount", this.props)
		// this.removeCommentBox = commentBox('5632675578642432-proj',{ defaultBoxId:this.props.id});
		this.removeCommentBox = commentBox('5706336549470208-proj',{ defaultBoxId:this.props.id});
		
    }

    componentWillUnmount = () => {
        this.removeCommentBox();
    }

	render() {
		var { id, d, articleDate, display_flag, article_image, article_title, description, url, children } = this.props;
		const { opened } = this.state;
		console.log("image", article_image);
		console.log("prop", this.props);
		// var bookmarks = JSON.parse(localStorage.getItem("bookmarks")).bookmark;
		let title = "";
		if(!display_flag){
			return(
				<div>
					<div className="box test">
						<div className="boxTitle" >
							<p className="title"><i>{article_title}</i></p>
							<div className="date_icon">
								<p><i>{articleDate}</i></p>
								<div className="shre">
									<div>
										<FacebookShareButton data-tip="Facebook" data-for="facebook" url="www.facebook.com" quote={url} hashtag="#CSCI_571_NewsApp" >
											<FacebookIcon size={32} round={true}/>	
										</FacebookShareButton>
										<ReactTooltip id="facebook" className="tooltip" place="top" type="dark" effect="solid" />
										<TwitterShareButton data-tip="Twitter" data-for="twitter" url="www.twitter.com" title={url} hashtags={["CSCI_571_NewsApp"]}>
											<TwitterIcon size={32} round={true}/>
										</TwitterShareButton>
										<ReactTooltip id="twitter" className="tooltip" place="top" type="dark" effect="solid" />
										<EmailShareButton data-tip="Email" data-for="email" url="www.gmail.com" subject="#CSCI_571_NewsApp" body={url}>
											<EmailIcon size={32} round={true}/>
										</EmailShareButton>
										<ReactTooltip id="email" className="tooltip" place="top" type="dark" effect="solid" />
									</div>
									<div className="bookmark" onClick={this.notify}>
										<p data-tip="bookmark" data-for="bookmark">
											{this.checkArticleInBookmark()===false?
											<IconContext.Provider value={{ color: "red" }}>
												<MdBookmarkBorder size={32}/>
											</IconContext.Provider>:
											<IconContext.Provider value={{ color: "red" }}>
												<MdBookmark size={32}/>
											</IconContext.Provider>
											}
										</p>
										<ReactTooltip id="bookmark" className="tooltip1" place="top" type="dark" effect="solid"/>
										<ToastContainer 
											position="top-center"
											autoClose={3000}
											hideProgressBar
											transition={Zoom}
											newestOnTop={false}
											closeOnClick={false}
											rtl={false}
											pauseOnVisibilityChange={false}
											draggable={false}
											pauseOnHover={false}
										/>
									</div>
									
								</div>
							</div>
							<br/>
							<img src={article_image} width="100%"/>
							<br/>
							{description}<br/>
						</div>
						
					</div>
					<div className="commentbox"/>
				</div>
			)
		}

		if (display_flag && opened){
			title = <MdKeyboardArrowUp size={32}/>;
			setTimeout(()=> {window.scrollTo({top: 10000, left: 0, behavior:'smooth'})}, 1);
		}else{
			title = <MdKeyboardArrowDown size={32}/>;
			setTimeout(()=> {window.scrollTo({top: 0, left: 0, behavior:'smooth'})}, 1);
		}
		return (
			<div>
			<div className="box test">
				<div className="boxTitle" >
					<p className="title"><i>{article_title}</i></p>
					<div className="date_icon">
						<p><i>{articleDate}</i></p>
						<div className="shre">
							<div>
								<FacebookShareButton data-tip="Facebook" data-for="facebook" url="www.facebook.com" quote={url} hashtag="#CSCI_571_NewsApp" >
									<FacebookIcon size={32} round={true}/>	
								</FacebookShareButton>
								<ReactTooltip id="facebook" className="tooltip" place="top" type="dark" effect="solid" />
								<TwitterShareButton data-tip="Twitter" data-for="twitter" url="www.twitter.com" title={url} hashtags={["CSCI_571_NewsApp"]}>
									<TwitterIcon size={32} round={true}/>
								</TwitterShareButton>
								<ReactTooltip id="twitter" className="tooltip" place="top" type="dark" effect="solid" />
								<EmailShareButton data-tip="Email" data-for="email" url="www.gmail.com" subject="#CSCI_571_NewsApp" body={url}>
									<EmailIcon size={32} round={true}/>
								</EmailShareButton>
								<ReactTooltip id="email" className="tooltip" place="top" type="dark" effect="solid" />
							</div>
							<div className="bookmark" onClick={this.notify}>
								<p data-tip="bookmark" data-for="bookmark">
								{this.checkArticleInBookmark()===false?
									<IconContext.Provider value={{ color: "red" }}>
										<MdBookmarkBorder size={32}/>
									</IconContext.Provider>:
									<IconContext.Provider value={{ color: "red" }}>
										<MdBookmark size={32}/>
									</IconContext.Provider>
								}
								</p>
								<ReactTooltip id="bookmark" className="tooltip" place="top" type="dark" effect="solid"/>
								<ToastContainer 
									position="top-center"
									autoClose={3000}
									hideProgressBar
									transition={Zoom}
									newestOnTop={false}
									closeOnClick={false}
									rtl={false}
									pauseOnVisibilityChange={false}
									draggable={false}
									pauseOnHover={false}
								/>
							</div>
							
						</div>
					</div>
					<br/>
					<img src={article_image} width="100%"/>
					<br/>
					{description}{!opened?"...":""}<br/>
				</div>
				{opened && (				
					<div class="boxContent">
						{children}
					</div>
				)}
				<div style={{height:'35px'}}>
					<span onClick={this.toggleBox} style={{float:'right'}}>{title}</span>	
				</div>
			</div>
			<div className="commentbox"/>
			</div>
		);
	}
}

export default ExpandedCard;