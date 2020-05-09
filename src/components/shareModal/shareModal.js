import {EmailShareButton,FacebookShareButton,TwitterShareButton, FacebookIcon, TwitterIcon, EmailIcon} from "react-share";
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import './shareModal.css';
import {IoMdShare} from 'react-icons/io';


class ShareModal extends React.Component {
	constructor(props){
		super(props);
	}

	Example = () => {
		// console.log(props.title);
		const [show, setShow] = React.useState(false);
	  
		const handleClose = () => {
			// console.log("handleclose", a);
			// event.stopPropagation();
			setShow(false);

			
		};
		const handleShow = (event) => {
			console.log("handleshow", event);
			event.preventDefault();
			event.stopPropagation();
			event.nativeEvent.stopImmediatePropagation();
			setShow(true);
		};
		// console.log(this.props.title);
		return (
		  <>
			<IoMdShare onClick={handleShow}>

			</IoMdShare>
			
	  
			<Modal show={show} onClick={handleClose}>
			  <Modal.Header closeButton>
				<Modal.Title>{this.props.title}</Modal.Title>
				</Modal.Header>
				{/* <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body> */}
				<Modal.Footer>
					<div className="mo-footer">
						Share Via
					</div>
					<div className="social_media_icons_row">
						<div className="icon left-align">
							<FacebookShareButton url="www.facebook.com" quote={this.props.url} hashtag="#CSCI_571_NewsApp">
								<FacebookIcon size={50} round={true}/>	
							</FacebookShareButton>
						</div>
						<div className="icon center-align">
							<TwitterShareButton url="www.twitter.com" title={this.props.url} hashtags={["CSCI_571_NewsApp"]}>
								<TwitterIcon size={50} round={true}/>
							</TwitterShareButton>
						</div>
						<div className="icon right-align">
							<EmailShareButton subject="CSCI_571_NewsApp" body={this.props.url}>
								<EmailIcon size={50} round={true}/>
							</EmailShareButton>
						</div>
					</div>
				</Modal.Footer>
			</Modal>
		  </>
		);
	  }

	render(){
		// console.log(this.props);
		return(<this.Example/>)
			// <div>
			// 	<Button variant="primary" onClick={this.handleShow}>
			// 		Launch demo modal
			// 	</Button>

			// 	<Modal show={show} onHide={this.handleClose}>
			// 		<Modal.Header closeButton>
			// 		<Modal.Title>Modal heading</Modal.Title>
			// 		</Modal.Header>
			// 		<Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
			// 		<Modal.Footer>
			// 		<Button variant="secondary" onClick={this.handleClose}>
			// 			Close
			// 		</Button>
			// 		<Button variant="primary" onClick={this.handleClose}>
			// 			Save Changes
			// 		</Button>
			// 		</Modal.Footer>
			// 	</Modal>
				
			// </div>
	}
}

export default ShareModal;