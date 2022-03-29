import { StyleSheet } from 'react-native';

// import { styles } from '../util/styles';

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
    justifyContent:'space-around',
  },
  horizontalMargin: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    justifyContent:'space-around',
    margin: 10,
  },
  textInput:{
      width: 200,
      height: 50,
      backgroundColor:"white",
      borderStyle:"solid",
      borderColor:"black",
      borderRadius:10,
      borderWidth: 2,
      marginBottom: 10
  },
  viewMain:{
      backgroundColor:"deepskyblue",
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  b:{
    fontWeight: "bold",
    flex: 1
  },
  b2:{
    fontWeight: "bold",
    flex: 2
  },
  bLink:{
    fontWeight: "bold",
    flex: 1,
    color: '#006adb'
  },
  b2Link:{
    fontWeight: "bold",
    flex: 2,
    color: '#006adb'
  },
  planelink:{
    color: '#0000aa',
    flex: 1,
    marginLeft: 10,
    marginTop: 5
  },
  listText:{
    flex:1,
    marginTop:5
  },
  listText2:{
    flex:2,
    marginTop:5
  },
  refreshbutton:{
    width: 150,
    margin: 5,
  },
});

// import { styles } from '../util/styles';