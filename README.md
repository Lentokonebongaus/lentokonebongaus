# Airplane GO ✈

Airplane GO is an Android and iOS application for surveying nearby planes and collecting plane cards. In addition to collecting and upgrading cards, registered users can play against other user's cards. *Gotta Fly 'Em All!* 
<p float="left">
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144123.png" alt="home screen" width="200"/>
<p>
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144332.png" alt="plane screen" width="200"/>
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144148.png" alt="card screen" width="200"/>
</p>
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

### Map view


<table border="0">
 <tr>
    <td><b style="font-size:30px">Title</b></td>
    <td><b style="font-size:30px">Title 2</b></td>
 </tr>
 <tr>
    <td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/screenshots/Screenshot_20220507-144225.png" alt="home screen" width="200"/></td>
    <td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/assets/plane_icon.png" alt="home screen" width="50"/></td>
<td><img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/main/assets/plane_icon_collected.png" alt="home screen" width="50"/><p>Hello</p></td>
 </tr>
</table>
Grounded planes are colored red in Map View.


