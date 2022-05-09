import { StyleSheet } from 'react-native';

export const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch: {
    width: 50,
    height: 200,
    resizeMode: 'stretch',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  horizontalMargin: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    margin: 10,
  },
  textInput: {
    width: 200,
    height: 50,
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 10
  },
  viewMain: {
    backgroundColor: "deepskyblue",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  b: {
    fontWeight: "bold",
    flex: 1
  },
  b2: {
    fontWeight: "bold",
    flex: 2
  },
  bLink: {
    fontWeight: "bold",
    flex: 1,
    color: '#006adb'
  },
  b2Link: {
    fontWeight: "bold",
    flex: 2,
    color: '#006adb'
  },
  planelink: {
    color: '#0000aa',
    flex: 1,
    marginLeft: 10,
    marginTop: 5
  },
  listText: {
    flex: 1,
    marginTop: 5
  },
  listText2: {
    flex: 2,
    marginTop: 5
  },
  refreshbutton: {
    width: 150,
    margin: 5,
  },
  card: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
  },
  cardText: {
    fontSize: 16,
    color: "white",
  },
  cardTextSmall: {
    fontSize: 11,
    color: "white",
  },
  cardTextHeader: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  horizontalCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20
  },

  //  cardsList
  cardsListLoadding: { height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  columnTitleNormal: {
    width: 120
  },
  columnTitleHighlighted: {
    width: 120,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10
  },
  dataTableCell: {
    width: 120
  },
  //Invariant Violation: "border" is not a valid style property.
  //otin ulos stylesheetistä ja pidän tyylit tavallisena objektina tämän takia
  cardsArea: {
    flex: 1,
    border: "solid",
    borderWidth: 2,
    borderColor: "red",
    height: "100%",
    width: "100%",
    flexDirection: "column"
  },
  tableRowCardUnavailable: {
    backgroundColor: "lightgray",
  },
  tableRowCardAvailable: {
  },

  //  cardview
  cardStar: { textAlign: "center", paddingBottom: 10 },

  //  kotinäkymä
  homescreenButtonstyle: {
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    backgroundColor: "rgba(20, 39, 155, 0.8)"
  },
  homescreenButtonContainer: {
    width: 200,
    marginHorizontal: 80,
    marginVertical: 10,
    alignSelf: "center"
  },
  homescreenIconContainerStyle: {
    marginLeft: 10,
    marginRight: -10
  },
  homescreenTitleStyle: {
    fontWeight: 'bold',
    fontSize: 14
  },
  homescreenContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40
  },
  homescreenWelcome: {
    fontWeight: "bold",
    fontSize: 50,
    paddingBottom: 30,
    color: "white",
    textAlign: "center"
  },
  homescreenUsername: {
    fontWeight: "bold",
    fontSize: 28,
    color: "white",
    textAlign: "center"
  },
  homescreenButtonArea: {
    flexDirection: 'column',
    flex: 2,
    justifyContent: "space-between",
    paddingBottom: 100
  },

  //  playview
  playViewCardsLoading: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  playCardsArea: {
    flex: 1,
    height: "100%",
    width: "100%",
    flexDirection: "column"
  },
  modifiersArea: {
    flex: 1,
    border: "solid",
    borderWidth: 1,
    borderColor: "blue",
  },
  playerArea: {
    flex: 4

  },
  computerArea: {
    flex: 4
  },
  playtableRowCardUnavailable: {
    backgroundColor: "firebrick",
  },
  playDataTableCell: {
    width: 100
  },

};

export const planeviewStyles = {
  divider: {
    height: 10
  },
  planeData: {
    flex: 1,
    flexDirection: "row"
  },
  planeDataText: {
    fontSize: 20,
    color: "#dee1ff",
    paddingLeft: 10,
    paddingTop: 5,
  },
  planeDataTextBold: {
    fontSize: 20,
    color: "white",
    paddingLeft: 10,
    paddingTop: 5,
    fontWeight: "bold"
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  dataLoading: {
    position: "absolute",
    marginLeft: 1000,
  },
  imageFrame: {
    height: 150,
    width: "100%",
  },
  imageLoading: {
    height: 150,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkblue"
  },
  grid: {

  },
  planeImage: {
    height: 150,
    width: "100%",
  },
  flag: {
    height: 200,
    width: 200,
    position: "absolute",
    zIndex: 100
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomDivider: {
    borderBottomColor: 'deepskyblue',
    borderBottomWidth: 2
  },
  planeCollectableText: {
    color: "chartreuse",
    fontSize: 20,
    paddingLeft: 10,
    paddingTop: 5,
    fontWeight: "bold"
  },
  planeNotCollectableText: {
    color: "crimson",
    fontSize: 20,
    paddingLeft: 10,
    paddingTop: 5,
    fontWeight: "bold"
  }

};
