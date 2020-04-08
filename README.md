# react-native-embed-instagram

Instagram Embed for React Native  

## What is it for?
Simple as that - we needed Instagram embeds in our application, and couldn't find anything decent on the internet.

Feel free to contribute.

## How does it work?

Use it to display standard Instagram embed "natively" (without WebView).

![Screenshot](https://github.com/Kobidl/react-native-embed-instagram/raw/master/screenshots/screenshot.png)

## Installation

### Installation

```
npm i --save react-native-embed-instagram
```

Example:

```
import InstagramEmbed from 'react-native-embed-instagram'  


<InstagramEmbed id="Bbbm0WmgVLa" style={{ width: "100%" }} />
```


#### Config

Property | Type | Default | Description
--- | --- | --- | ---
id | string | "" |The ID of the post
style | object | {} | The container Style
showAvatar | boolean | true | Show the author details
showCaption | boolean | true | Show the post caption
showStats | boolean | true | Show the post stats
avatarStyle | object | {} | Avatar style
nameStyle | object | {} | Author username style
thumbnailStyle | object | {} | Thumbnail style
renderCaption | fun | null | Render caption function


## License
MIT.
