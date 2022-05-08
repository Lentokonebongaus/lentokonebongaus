# Airplane GO ✈

Airplane GO is an Android and iOS application for surveying nearby planes and collecting plane cards. In addition to collecting and upgrading cards, registered users can also play against other user's cards.  
<p float="left">
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144123.png" alt="home screen" width="200"/>
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144332.png" alt="plane screen" width="200"/>
<img src="https://github.com/Lentokonebongaus/lentokonebongaus/blob/development/screenshots/Screenshot_20220507-144148.png" alt="card screen" width="200"/>
</p>

## Used technologies and services 

| Technology/service | Use |
|:-------------|:-------------|
| [React Native](https://reactnative.dev/) |Framework|
| [Expo](https://expo.dev/) | SDK |
| [Firebase](https://firebase.google.com/) |Database|
| [Azure](https://portal.azure.com/) |Image search|
| [Linode](https://www.linode.com/) |Backend server|

## Features and functionalities in detail 

The application has surveying features available to both registered and unregistered users. Users can view the location and properties of every nearby plane on a map or on a sortable list. Users can also see more details such as picture, model and manufacturer when viewing a single plane.

Registered and logged users can transform nearby planes into plane cards, which can then be upgraded and used to play against other users' cards. By playing against other user's cards, user's can increase their card's stats, but a card's stats are also increased passively by having them being played by an AI against other users. 

In addition to playing, users can increase their card's quality by keeping an eye on the map view when an already collected plane is nearby. If a familiar plane is flying closer, higher and faster than before, it's corresponding card can upgraded.

User's current card collection is also available to be admired at separately or in two different list views. A plane card displays it's corresponding plane's model, manufacturer and picture, but every card also has their unique card quality and win/lose attributes.
