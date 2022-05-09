# Airplane GO ✈

Airplane GO is an Android and iOS application for surveying nearby planes and collecting plane cards. In addition to collecting and upgrading cards, registered users can play against other user's cards. *Gotta Fly 'Em All!* 
<p float="left">
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144123.png" alt="home screen" width="200"/>
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144332.png" alt="plane screen" width="200"/>
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144148.png" alt="card screen" width="200"/>
</p>

## Used technologies and services 

| Technology/service | Use |
|:-------------|:-------------|
| [React Native](https://reactnative.dev/) |Framework|
| [TypeScript](https://www.typescriptlang.org/download) |Programming Language|
| [Expo](https://expo.dev/) | SDK |
| [Firebase](https://firebase.google.com/) |Database|
| [Azure](https://portal.azure.com/) |Image search|
| [Linode](https://www.linode.com/) |Backend server|

## Notable external libraries

### Front-end libraries

| Library | Use |
|:-------------|:-------------|
| [UI Kitten](https://akveo.github.io/react-native-ui-kitten/) |Buttons and icons|
| [React Native Paper](https://reactnativepaper.com/) | Lists and grids |
| [React Native Animated SpinKit](https://www.npmjs.com/package/react-native-animated-spinkit) |Loading animations|
| [React Native Firebase](https://rnfirebase.io/) |Firebase connectivity|
| [React Native CryptoJS](https://www.npmjs.com/package/react-native-crypto-js) |User password AES encryption and decryption|
| [react-native-maps](https://www.npmjs.com/package/react-native-maps) |Google Maps for React Native|
| [react-spring/native](https://www.npmjs.com/package/@react-spring/native) |Animations|
| [react-native-draggable](https://www.npmjs.com/package/react-native-draggable) |Draggable cards|


### Back-end libraries

| Library | Use |
|:-------------|:-------------|
| [Flask](https://flask.palletsprojects.com/en/2.1.x/) |Web framework|
| [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) | Text (and image) scraping |

## Features and functionalities in detail 

The application has surveying features available to both registered and unregistered users. Users can view the location and properties of every nearby plane on a map or on a sortable list. Users can also see more details such as picture, model and manufacturer when viewing a single plane.

Registered and logged users can transform nearby planes into plane cards, which can then be upgraded and used to play against other users' cards. By playing against other user's cards, user's can increase their card's stats, but a card's stats are also increased passively by having them being played by an AI against other users. 

In addition to playing, users can increase their card's quality by keeping an eye on the map view when an already collected plane is nearby. If a familiar plane is flying closer, higher and faster than before, it's corresponding card can upgraded.

User's current card collection is also available to be admired at separately or in two different list views. A plane card displays it's corresponding plane's model, manufacturer and picture, but every card also has their unique card quality and win/lose attributes.

Airplane GO mostly uses traditional smartphone application UI design patterns with tabs, stacks, and familiar icons. There are, however, still some areas, such as map view and play view, in which underlying functionalities or features aren’t especially clearly communicated through user interface. 

### Map view

<table border="0">
 <tr>
    <td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/screenshots/Screenshot_20220507-144225.png" alt="map_screen" width="200"/></td>
    <td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/assets/plane_icon.png" alt="plane_normal" width="50"/><p>Not collected</p></td>
    <td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/assets/plane_icon_collected.png" alt="plane_collected" width="50"/><p>Collected. Not upgradable</p></td>
   <td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/assets/plane_icon_collected_upgradable.png" alt="plane_collected_upgradable" width="50"/><p>Collected. Upgradable</p></td>
    <td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/assets/plane_icon_grounded.png" alt="plane_grounded_normal" width="50"/><p>Landed. Not collected</p></td>
   <td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/assets/plane_icon_grounded_collected.png" alt="plane_grounded_collected" width="50"/><p>Landed. Collected</p></td>
 </tr>
</table>

In map view, like in plane list view, nearby planes are updated every 7 seconds. An update consists of an api call to [The OpenSky Network's Live API](https://openskynetwork.github.io/opensky-api/), comparison of surrounding planes’ icao24 to user’s current card’s icao24, creation of temporary cards for every surrounding plane that the user has created a card from, and comparison of cardQuality value of every temporary card to that of the corresponding current card. This way all the surrounding planes can be categorized to one of the six different categories.

The categorization isn’t apparent to the user before (or possibly even after) moving to a plane view from map view. Therefore one possible development aspect could be to add a sidebar displaying the icons and their explanation, for example. For airplanes enthusiasts and experienced smartphone users current GitHub documentation could suffice, though.

## Play view
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/screenshots/Screenshot_20220507-144400.png" alt="map_screen" width="200"/>


