/**
 * Instagram Embed component for React Native
 */

import React from 'react';
import { View, Image, Text, ViewStyle, ImageStyle, TextStyle } from 'react-native';

import styles from './index-styles';

interface Props {
  id: string,
  style: ViewStyle,
  showAvatar: boolean,
  showCaption: boolean,
  showStats: boolean,
  avatarStyle: ImageStyle,
  nameStyle: TextStyle,
  thumbnailStyle: ImageStyle,
  renderCaption: (text: string) => {},
}

interface State {
  response: any,
  height: number,
  width: number,
  avatar: string,
  likes: number | string,
  comments: number | string,
  thumbnail: string,
}

export default class InstagramEmbed extends React.Component<Props, State> {

  static defaultProps = {
    showAvatar: false,
    showCaption: false,
    showStats: false,
    style: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      response: null,
      height: 240,
      width: 320,
      avatar: null,
      likes: 0,
      comments: 0,
      thumbnail: null,
    };
  }

  _onLayout = layout => {
    this.setState({
      height: layout.nativeEvent.layout.height,
      width: layout.nativeEvent.layout.width,
    });
  };

  /*
   * This is fairly experimental and probably not the best way to supplement
   * existing API (official) data with missing properties we need.
   */
  _fetchComplementaryData = id => {

    if (!id) {
      return;
    }

    fetch(`https://www.instagram.com/p/${id}/embed/captioned/`)
      .then(response => response.text())
      .then(responseText => {
        // The image from there not working ATM
        // let avatarUrl = "";
        // let avatarRegex = /class=\"Avatar\"[^>]*>.*<img.*src=\"([^"]+)\".*<\/a>/s;
        // let avatarMatch = avatarRegex.exec(responseText);
        // if (avatarMatch && avatarMatch.length > 0) {
        //   avatarUrl = avatarMatch[1];
        // } else {
        //   try {
        //     avatarRegex = /class=\"Avatar InsideRing\"[^>]*>.*<img.*src=\"([^"]+)\".*<\/a>/s;
        //     avatarMatch = avatarRegex.exec(responseText);
        //     if (avatarMatch) {
        //       avatarUrl = avatarMatch[0];
        //       avatarUrl = avatarUrl.substring(avatarUrl.indexOf("src=") + 5);
        //       avatarUrl = avatarUrl.substring(0, avatarUrl.indexOf("\""));
        //     }
        //   } catch (e) { }
        // }

        let likesRegex = /class=\"SocialProof\">[^>]*>([^l]*)/s;
        let likesMatch = likesRegex.exec(responseText);

        // let viewsRegex = /class=\"SocialProof\">[^>]*>([^l]*)/s;
        // let viewsMatch = viewsRegex.exec(responseText);

        let commentsRegex = /class=\"CaptionComments\">[^>]*>([^c]*)/s;
        let commentsMatch = commentsRegex.exec(responseText);

        let thumbnailRegex = /class=\"EmbeddedMediaImage\"[^>]*>.*<img.*src=\"([^"]+)\".*<\/a>/s;
        let thumbnailMatch = thumbnailRegex.exec(responseText);
        let thumbnailUrl = "";
        if (thumbnailMatch) {
          try {
            thumbnailUrl = thumbnailMatch[0];
            thumbnailUrl = thumbnailUrl.substring(thumbnailUrl.indexOf("src") + 5, thumbnailUrl.indexOf(">"));
            let thumbnailUrls = thumbnailUrl.split(' ');
            thumbnailUrl = thumbnailUrls[0].replace('"', '');
          } catch (e) { }
        }

        this.setState({
          thumbnail: thumbnailUrl ? thumbnailUrl : null,
          // avatar: avatarUrl ? avatarUrl : null,
          likes: likesMatch ? likesMatch[1].trim() : null,
          // views: viewsMatch ? viewsMatch[1] : null,
          comments: commentsMatch ? commentsMatch[1].replace("view all", "").trim() : null,
        });
      })
      .catch(error => { });
  };

  _fetchAvatar = (url) => {
    fetch(url).then(r => r.text()).then(r => {
      const property = 'og:image" content="';
      const propertyIndex = r.indexOf(property);
      if (propertyIndex > -1) {
        let avatarUrl = r.substring(r.indexOf(property) + property.length);
        avatarUrl = avatarUrl.substring(0, avatarUrl.indexOf('"'));
        if (avatarUrl) {
          this.setState({ avatar: avatarUrl });
        }
      }
    });
  }

  componentDidMount = () => {
    const { id } = this.props;
    fetch(`https://api.instagram.com/oembed/?url=http://instagr.am/p/${id}/`)
      .then(response => response.json())
      .then(responseJson => {
        if (this.props.showStats)
          this._fetchComplementaryData(id);
        if (this.props.showAvatar)
          this._fetchAvatar(responseJson.author_url);
        this.setState({ response: responseJson });
      })
      .catch(error => {
        this.setState({ response: null });
      });
  };

  render() {
    let { style, showAvatar,  showStats, avatarStyle, nameStyle, thumbnailStyle } = this.props;
    const {
      response,
      height,
      width,
      avatar,
      likes,
      comments,
      thumbnail
    } = this.state;

    if (!response) {
      return <View style={[{ width: 0, height: 0 }, style]} />;
    }

    return (
      <View
        style={[
          styles.container,
          style,
          {
            height: height,
          },
        ]}
      >
        <View onLayout={this._onLayout}>
          {showAvatar && <View style={styles.headerContainer}>
            {avatar && (
              <Image
                source={{
                  uri: avatar,
                }}
                style={[styles.avatar, avatarStyle]}
              />
            )}
            <Text style={[styles.author, nameStyle]}>{response.author_name}</Text>
          </View>}
          {(response.thumbnail_url || thumbnail) ? (
            <Image
              source={{ uri: thumbnail ? thumbnail : response.thumbnail_url }}
              style={[{
                height:
                  response.thumbnail_height * width / response.thumbnail_width,
              }, thumbnailStyle]}
            />
          ) : <></>}
          <View style={{ flexDirection: 'column', margin: 8 }}>
            {showStats && <View style={styles.statsContainer}>
              {/* {!!views && (
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('./assets/images/icon_views.png')}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statLabel}>{views} views</Text>
                </View>
              )} */}
              {!!likes && (
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('./assets/images/icon_likes.png')}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statLabel}>{likes} likes</Text>
                </View>
              )}
              {!!comments && (
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('./assets/images/icon_comments.png')}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statLabel}>{comments} comments</Text>
                </View>
              )}
            </View>}
            {this.renderCaption()}
          </View>
        </View>
      </View>
    );
  }

  renderCaption = () => {
    if (!this.props.showCaption || !this.state.response) return null;
    if (this.props.renderCaption) this.props.renderCaption(this.state.response.title);
    return (
      <Text>{this.state.response.title}</Text>
    )
  }
}
