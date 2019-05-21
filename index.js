/**
 * Instagram Embed component for React Native
 */

import React, { PureComponent } from 'react';
import { View, Image, Text } from 'react-native';

import styles from './index-styles';

export default class InstagramEmbed extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
      height: 240,
      width: 320,
      avatar: null,
      likes: 0,
      // views: 0,
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
        let avatarRegex = /class=\"Avatar\"[^>]*>.*<img.*src=\"([^"]+)\".*<\/a>/s;
        let avatarMatch = avatarRegex.exec(responseText);

        let likesRegex = /class=\"SocialProof\">[^>]*>([^l]*)/s;
        let likesMatch = likesRegex.exec(responseText);

        // let viewsRegex = /class=\"SocialProof\">[^>]*>([^l]*)/s;
        // let viewsMatch = viewsRegex.exec(responseText);

        let commentsRegex = /class=\"CaptionComments\">[^>]*>([^c]*)/s;
        let commentsMatch = commentsRegex.exec(responseText);

        let thumbnailRegex = /class=\"EmbeddedMedia\"[^>]*>.*<img.*src=\"([^"]+)\".*<\/a>/s;
        let thumbnailMatch = thumbnailRegex.exec(responseText);

        this.setState({
          thumbnail: thumbnailMatch ? thumbnailMatch[1] : null,
          avatar: avatarMatch ? avatarMatch[1] : null,
          likes: likesMatch ? likesMatch[1].trim() : null,
          // views: viewsMatch ? viewsMatch[1] : null,
          comments: commentsMatch ? commentsMatch[1].replace("view all", "").trim() : null,
        });
      })
      .catch(error => { });
  };

  componentDidMount = () => {
    const { id } = this.props;
    fetch(`https://api.instagram.com/oembed/?url=http://instagr.am/p/${id}/`)
      .then(response => response.json())
      .then(responseJson => {
        this._fetchComplementaryData(id);
        this.setState({ response: responseJson });
      })
      .catch(error => {
        this.setState({ response: null });
      });
  };

  render(): JSX.JSXElement {
    let { style, showAvatar, showCaption, showStats } = this.props;
    const {
      response,
      height,
      width,
      avatar,
      likes,
      comments,
      // views,
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
        {showAvatar &&<View style={styles.headerContainer}>
             {avatar && (
              <Image
                source={{
                  uri: avatar,
                }}
                style={styles.avatar}
              />
            )}
            <Text style={styles.author}>{response.author_name}</Text>
          </View>}
          {!!response.thumbnail_url && (
            <Image
              source={{ uri: response.thumbnail_url }}
              style={{
                height:
                  response.thumbnail_height * width / response.thumbnail_width,
              }}
            />
          )}
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
            {showCaption && <Text>{response.title}</Text>}
          </View>
        </View>
      </View>
    );
  }
}

InstagramEmbed.defaultProps = {
  id: "",
  style: {},
  showAvatar: true,
  showCaption: true,
  showStats: true
}