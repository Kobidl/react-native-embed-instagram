/**
 * Instagram Embed component for React Native
 * https://github.com/GaborWnuk
 * @flow
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
      views: 0,
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

    fetch(`https://api.instagram.com/oembed/?url=http://instagr.am/p/${id}/`)
      .then(response => response.text())
      .then(responseText => {
        console.log(responseText);
        let avatarRegex = /class\=\"ehAvatar\"\s+src=\"([a-zA-Z0-9\-\\\:\/\.\_]+)\"/g;
        let avatarMatch = avatarRegex.exec(responseText);

        let likesRegex = /span\s+class\=\"espMetricTextCollapsible\"><\/span>([0-9\,\.km]+)<span\s+class\=\"espMetricTextCollapsible\">\s+likes?/g;
        let likesMatch = likesRegex.exec(responseText);

        let viewsRegex = /span\s+class\=\"espMetricTextCollapsible\"><\/span>([0-9\,\.km]+)<span\s+class\=\"espMetricTextCollapsible\">\s+views?/g;
        let viewsMatch = viewsRegex.exec(responseText);

        let commentsRegex = /span\s+class\=\"espMetricTextCollapsible\"><\/span>([0-9\,\.km]+)<span\s+class\=\"espMetricTextCollapsible\">\s+comments?/g;
        let commentsMatch = commentsRegex.exec(responseText);

        let thumbnailRegex = /class\=\"efImage\"\s+src=\"([a-zA-Z0-9\-\\\:\/\.\_]+)\"/g;
        let thumbnailMatch = thumbnailRegex.exec(responseText);

        this.setState({
          thumbnail: thumbnailMatch ? thumbnailMatch[1] : null,
          avatar: avatarMatch ? avatarMatch[1] : null,
          likes: likesMatch ? likesMatch[1] : null,
          views: viewsMatch ? viewsMatch[1] : null,
          comments: commentsMatch ? commentsMatch[1] : null,
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
    const { style } = this.props;
    const {
      response,
      height,
      width,
      avatar,
      likes,
      comments,
      views,
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
          <View style={styles.headerContainer}>
            {avatar && (
              <Image
                source={{
                  uri: avatar,
                }}
                style={styles.avatar}
              />
            )}
            <Text style={styles.author}>{response.author_name}</Text>
          </View>
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
            <View style={styles.statsContainer}>
              {!!views && (
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('./assets/images/icon_views.png')}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statLabel}>{views} views</Text>
                </View>
              )}
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
            </View>
            <Text>{response.title}</Text>
          </View>
        </View>
      </View>
    );
  }
}
