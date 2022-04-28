import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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

  // --- used in ListPlanes ---
  columnHighlighted: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10
  },
  planeCollectedRow: {
    backgroundColor: "#2626FF",
  },
  planeCollectableRow: {
    backgroundColor: "#51FF51"
  },
  planeCollectableText: {
    color: "chartreuse"
  },
  planeNotCollectableText: {
    color: "crimson"
  },
  planeNotCollectableRow: {
    backgroundColor: "#FF4719"
  },


  // --- used in PlaneView ---
  divider: {
    height: 10
  },
  planeData: {
    backgroundColor: "deepskyblue",
    flex: 1,
  },
  planeDataText: {
    fontSize: 20,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "deepskyblue"
  },
  grid: {

  },
  planeImage: {
    height: "100%",
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

  button: {

  },

});