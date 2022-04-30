import { useEffect, useState, useContext } from "react";
import { Button, FlatList, Text, View, SafeAreaView, ScrollView } from "react-native";
import  planesData from '../util/planesData';
import fetchplanesData from '../util/planesData';
import Plane from "../util/Plane"
import distanceBetween from '../util/distanceBetween';
import * as Location from 'expo-location';
import { refreshPlanes, setGPSlocation } from "../util/locationFunctions";
import { PlanesContext } from "../util/PlanesProvider"

import { DataTable } from 'react-native-paper';
import getFlagEmoji from '../util/getFlagEmoji'
import { styles } from '../util/styles';
import { UserCardsContext, icao24InUsersCards } from "../util/UserCardsProvider";
import { UserLocationContext } from "../util/UserLocationProvider";

const optionsPerPage = [2, 3, 4];

export default function ListPlanes (props:any){
  const [location, setLocation] = useState({longitude:0, latitude:0});
  const [initialLocationChanged, setInitialLocationChanged] = useState(false)
  const [region, setRegion] = useState({longitude:24.9049634, latitude:60.2494251 , latitudeDelta: 0.20, longitudeDelta: 0.02});
  const [errorMsg, setErrorMsg] = useState("");
  //const [planes, setPlanes] = useState<any[]>([])
  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  const { planes, setPlanes } = useContext(PlanesContext)
  const { userCards, setUserCards } = useContext(UserCardsContext)
  const { userLocation, setUserLocation } = useContext(UserLocationContext)
  const [listedPlanes, setListedPlanes] = useState([])

  const [sortDirections, setSortDirections] = useState({
    icao24:"descending",
    callsign:"descending",
    country: "descending",
    distance: "descending"
  })

  const [sortBy, setSortBy] = useState("distance")


  useEffect(() => {
    setGPSlocation(setLocation, setErrorMsg);
  }, []);

  useEffect(()=>{
    sortListedPlanes()
  },[planes])

  useEffect(()=>{
    refreshPlanes(location, setPlanes);
  },[sortBy])

  useEffect(()=>{
    refreshPlanes(location, setPlanes);
  },[sortDirections])

  /*useEffect(()=>{
    console.log("LISTED PLANES FIRST:")
    console.log(listedPlanes[0])
  },[listedPlanes])*/

  /*useEffect(()=>{
    if(location.longitude != 0 && location.latitude != 0){
      refreshPlanes(location, setPlanes);
      sortListedPlanes()
    }
  },[location])

  useEffect(() => {
    if(initialLocationChanged == true){
      refreshLoop(location)
    }
  }, [initialLocationChanged])

  useEffect(()=>{
    if(location.longitude != 0 && location.latitude != 0){
      refreshPlanes(location, setPlanes)
      setInitialLocationChanged(true)
    }
  },[location])

  const refreshLoop = (location: any) =>{
    setInterval(()=>{refreshPlanes(location, setPlanes)},7000)
  }*/

  
  function sortListedPlanes(){

    const sortedPlanes = [...planes].sort((a, b) => {
      if(parseFloat(a[sortBy])){
        if(sortDirections[sortBy] == "ascending"){
          return(parseFloat(a[sortBy]) < parseFloat(b[sortBy]))
        } else{
          return(parseFloat(a[sortBy]) > parseFloat(b[sortBy]))
        }
      } else{
        if(sortDirections[sortBy] == "ascending"){
          return(a[sortBy] < b[sortBy])
        } else{
          return(a[sortBy] < b[sortBy])
        }
      }
    });
    setListedPlanes(sortedPlanes);
  }

  /*function sortPlanes(){
    const sortedPlanes = [...planes].sort((plane1, plane2)=>{return(plane1[sortedBy]>plane2[sortedBy])})
  }*/
  
  const getDataTableRow = (plane:Plane) =>{
    return(
      <DataTable.Row style={icao24InUsersCards(userCards, plane.icao24)==true?styles.planeCollectedRow:undefined} onPress={()=>props.navigation.navigate("Plane", {plane:plane, location:userLocation})}>
          <DataTable.Cell>{plane.icao24}</DataTable.Cell>
          <DataTable.Cell>{plane.callsign}</DataTable.Cell>
          <DataTable.Cell>{getFlagEmoji(plane.originCountry)}</DataTable.Cell>
          <DataTable.Cell><Text style={plane.distance<=70?styles.planeCollectableText:styles.planeNotCollectableText}>{plane.distance} km</Text></DataTable.Cell>
      </DataTable.Row>
    )

  }

  

  /*return (
    <View>
      {
      <View style={styles.refreshbutton}>
        <Button title='refresh' onPress={() => refreshPlanes(location, setPlanes)}/>
      </View>
      }
      <View style={styles.horizontalMargin}>
        <Text style={styles.bLink} onPress={() => sortPlanes('icao24')}>Icao24</Text>
        <Text style={styles.bLink} onPress={() => sortPlanes('callsign')}>Callsign</Text>
        <Text style={styles.b2Link} onPress={() => sortPlanes('originCountry')}>Origin Country</Text>
        <Text style={styles.b}>Longitude</Text>
        <Text style={styles.b}>Latitude</Text>
      </View>
      <FlatList 
        keyExtractor={(item, index) => index.toString()} 
        renderItem={ ({item}) => 
        <View style={styles.horizontal}>
          <Text onPress={()=>{props.navigation.navigate("Plane", {plane:item})}}
            style={styles.planelink}>{item.icao24}</Text>
          <Text style={styles.listText}>{item.callsign}</Text>
          <Text style={styles.listText2}>{item.originCountry}</Text>
          <Text style={styles.listText}>{item.longitude}</Text>
          <Text style={{...styles.listText, marginRight:10}}>{item.latitude}</Text>
        </View> }
        data={planes}
      />
    </View>
  );*/

  const styles={
    columnHighlighted:{
      borderStyle:"solid", 
      borderWidth:1, 
      borderColor:"blue", 
      borderRadius:10
    },
    planeCollectedRow:{
      backgroundColor:"#2626FF", 
    },
    planeCollectableRow:{
      backgroundColor:"#51FF51"
    },
    planeCollectableText:{
      color: "chartreuse"
    },
    planeNotCollectableText:{
      color: "crimson"
    },
    planeNotCollectableRow:{
      backgroundColor:"#FF4719"
    },
  }
  return (
    <SafeAreaView>
    <ScrollView>
    <DataTable>
      <DataTable.Header>
        <DataTable.Title sortDirection={sortDirections.icao24} onPress={()=>{
            sortDirections.icao24=="descending"?setSortDirections({...sortDirections,icao24:"ascending"}):setSortDirections({...sortDirections,icao24:"descending"})
            setSortBy("icao24")
          }}
        style={sortBy=="icao24"?styles.columnHighlighted:undefined}
        >icao24
        </DataTable.Title>

        <DataTable.Title sortDirection={sortDirections.callsign} onPress={()=>{
            sortDirections.callsign=="descending"?setSortDirections({...sortDirections,callsign:"ascending"}):setSortDirections({...sortDirections,callsign:"descending"})
            setSortBy("callsign")
          }}
        style={sortBy=="callsign"?styles.columnHighlighted:undefined}
        >Callsign
        </DataTable.Title>

        <DataTable.Title sortDirection={sortDirections.country} onPress={()=>{
            sortDirections.country=="descending"?setSortDirections({...sortDirections,country:"ascending"}):setSortDirections({...sortDirections,country:"descending"})
            setSortBy("originCountry")
          }}
        style={sortBy=="originCountry"?styles.columnHighlighted:undefined}
        >Country
        </DataTable.Title>

        <DataTable.Title sortDirection={sortDirections.distance} onPress={()=>{
            sortDirections.distance=="descending"?setSortDirections({...sortDirections,distance:"ascending"}):setSortDirections({...sortDirections,distance:"descending"})
            setSortBy("distance")
          }}
        style={sortBy=="distance"?styles.columnHighlighted:undefined}
        >Distance
        </DataTable.Title>

      </DataTable.Header>

      {listedPlanes.map((plane)=>getDataTableRow(plane))}

    </DataTable>
    </ScrollView>
    </SafeAreaView>
  );
  
}