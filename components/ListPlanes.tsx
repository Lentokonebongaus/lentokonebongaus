import { useEffect, useState, useContext } from "react";
import { Text, SafeAreaView, ScrollView } from "react-native";
import Plane from "../util/Plane"
import { refreshPlanes, setGPSlocation } from "../util/locationFunctions";
import { PlanesContext } from "../util/PlanesProvider"
import { DataTable } from 'react-native-paper';
import getFlagEmoji from '../util/getFlagEmoji'
import { styles } from '../util/styles';
import { UserCardsContext, icao24InUsersCards } from "../util/UserCardsProvider";
import { UserLocationContext } from "../util/UserLocationProvider";

const optionsPerPage = [2, 3, 4];

export default function ListPlanes(props: any) {
  const { planes, setPlanes } = useContext(PlanesContext)
  const { userCards, setUserCards } = useContext(UserCardsContext)
  const { userLocation, setUserLocation } = useContext(UserLocationContext)
  const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
  const [errorMsg, setErrorMsg] = useState("");
  const [listedPlanes, setListedPlanes] = useState([])
  // NOTE: these may be used in listing
  //const [page, setPage] = useState<number>(0);
  //const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);

  const [sortDirections, setSortDirections] = useState({
    icao24: "descending",
    callsign: "descending",
    country: "descending",
    distance: "descending"
  })

  const [sortBy, setSortBy] = useState("distance")

  useEffect(() => {
    setGPSlocation(setLocation, setErrorMsg);
  }, []);

  useEffect(() => {
    sortListedPlanes()
  }, [planes])

  useEffect(() => {
    refreshPlanes(location, setPlanes);
  }, [sortBy])

  useEffect(() => {
    refreshPlanes(location, setPlanes);
  }, [sortDirections])


  function sortListedPlanes() {

    const sortedPlanes = [...planes].sort((a, b) => {
      if (parseFloat(a[sortBy])) {
        if (sortDirections[sortBy] == "ascending") {
          return (parseFloat(a[sortBy]) < parseFloat(b[sortBy]))
        } else {
          return (parseFloat(a[sortBy]) > parseFloat(b[sortBy]))
        }
      } else {
        if (sortDirections[sortBy] == "ascending") {
          return (a[sortBy] < b[sortBy])
        } else {
          return (a[sortBy] < b[sortBy])
        }
      }
    });
    setListedPlanes(sortedPlanes);
  }

  const getDataTableRow = (plane: Plane) => {
    return (
      <DataTable.Row style={icao24InUsersCards(userCards, plane.icao24) == true ? styles.planeCollectedRow : undefined} onPress={() => props.navigation.navigate("Plane", { plane: plane, location: userLocation })}>
        <DataTable.Cell>{plane.icao24}</DataTable.Cell>
        <DataTable.Cell>{plane.callsign}</DataTable.Cell>
        <DataTable.Cell>{getFlagEmoji(plane.originCountry)}</DataTable.Cell>
        <DataTable.Cell><Text style={plane.distance <= 70 ? styles.planeCollectableText : styles.planeNotCollectableText}>{plane.distance} km</Text></DataTable.Cell>
      </DataTable.Row>
    )

  }

  return (
    <SafeAreaView>
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title sortDirection={sortDirections.icao24} onPress={() => {
              sortDirections.icao24 == "descending" ? setSortDirections({ ...sortDirections, icao24: "ascending" }) : setSortDirections({ ...sortDirections, icao24: "descending" })
              setSortBy("icao24")
            }}
              style={sortBy == "icao24" ? styles.columnHighlighted : undefined}
            >icao24
            </DataTable.Title>

            <DataTable.Title sortDirection={sortDirections.callsign} onPress={() => {
              sortDirections.callsign == "descending" ? setSortDirections({ ...sortDirections, callsign: "ascending" }) : setSortDirections({ ...sortDirections, callsign: "descending" })
              setSortBy("callsign")
            }}
              style={sortBy == "callsign" ? styles.columnHighlighted : undefined}
            >Callsign
            </DataTable.Title>

            <DataTable.Title sortDirection={sortDirections.country} onPress={() => {
              sortDirections.country == "descending" ? setSortDirections({ ...sortDirections, country: "ascending" }) : setSortDirections({ ...sortDirections, country: "descending" })
              setSortBy("originCountry")
            }}
              style={sortBy == "originCountry" ? styles.columnHighlighted : undefined}
            >Country
            </DataTable.Title>

            <DataTable.Title sortDirection={sortDirections.distance} onPress={() => {
              sortDirections.distance == "descending" ? setSortDirections({ ...sortDirections, distance: "ascending" }) : setSortDirections({ ...sortDirections, distance: "descending" })
              setSortBy("distance")
            }}
              style={sortBy == "distance" ? styles.columnHighlighted : undefined}
            >Distance
            </DataTable.Title>

          </DataTable.Header>

          {listedPlanes.map((plane) => getDataTableRow(plane))}

        </DataTable>
      </ScrollView>
    </SafeAreaView>
  );

}