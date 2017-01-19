import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import autoBind from 'react-autobind';
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';


export const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
} = ShareButtons;

export const {
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount,
  PinterestShareCount,
} = ShareCounts;

export const FacebookIcon = generateShareIcon('facebook');
export const TwitterIcon = generateShareIcon('twitter');
export const GooglePlusIcon = generateShareIcon('google');
export const LinkedinIcon = generateShareIcon('linkedin');
export const PinterestIcon = generateShareIcon('pinterest');
export const VKIcon = generateShareIcon('vk');


class SosmedShare extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    
	render () {
		return (
            <div>
                <FacebookShareButton
                    url={this.props.shareUrl}
                    title={this.props.title}
                    className="Demo__some-network__share-button">
                    <FacebookIcon
                    size={32}
                    round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={this.props.shareUrl}
                    title={this.props.title}
                    className="Demo__some-network__share-button">
                    <TwitterIcon
                    size={32}
                    round />
                </TwitterShareButton>
                <GooglePlusShareButton
                    url={this.props.shareUrl}
                    title={this.props.title}
                    className="Demo__some-network__share-button">
                    <GooglePlusIcon
                    size={32}
                    round />
                </GooglePlusShareButton>
                <LinkedinShareButton
                    url={this.props.shareUrl}
                    title={this.props.title}
                    windowWidth={750}
                    windowHeight={600}
                    className="Demo__some-network__share-button">
                    <LinkedinIcon
                    size={32}
                    round />
                </LinkedinShareButton>
            </div>
			
		);
	}
};

                        
export default SosmedShare;
/*
*/