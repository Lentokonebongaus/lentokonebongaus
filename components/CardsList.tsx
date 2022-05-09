import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { styles } from '../util/styles';
import { useContext, useEffect, useState } from "react"
import { DataTable } from 'react-native-paper';
import { UserCardsContext } from "../util/UserCardsProvider";
import { UserLocationContext } from '../util/UserLocationProvider';
import { getPlaneCurrentData } from '../util/locationFunctions';
import { Fold } from 'react-native-animated-spinkit';

export default function CardsList(props: any) {

    const { userCards, setUserCards } = useContext(UserCardsContext)
    const { userLocation, setUserLocation } = useContext(UserLocationContext)

    const [cardsWithCurrentData, setCardsWithCurrentData] = useState(undefined)
    const [sortDirections, setSortDirections] = useState({
        manufacturer: "ascending",
        model: "ascending",
        owner: "ascending",
        distance: "ascending",
        quality: "ascending"
    })
    const [sortBy, setSortBy] = useState("manufacturer")

    useEffect(() => {
        fetchCardsWithCurrentData()
    }, [])

    useEffect(() => {
        if (cardsWithCurrentData != undefined) {
            sortListedCards()
        }
    }, [sortBy])

    useEffect(() => {
        if (cardsWithCurrentData != undefined) {
            sortListedCards()
        }
    }, [sortDirections])


    function sortListedCards() {

        const tmpCards = [...cardsWithCurrentData].sort((a, b) => {
            if (parseFloat(a[sortBy]) && parseFloat(b[sortBy])) {
                if (sortDirections[sortBy] == "ascending") {
                    return (parseFloat(a[sortBy]) < parseFloat(b[sortBy]))
                } else {
                    return (parseFloat(a[sortBy]) > parseFloat(b[sortBy]))
                }
            } else {
                if (sortDirections[sortBy] == "ascending") {
                    return (a[sortBy] < b[sortBy])
                } else {
                    return (a[sortBy] > b[sortBy])
                }
            }
        });
        setCardsWithCurrentData(tmpCards);
    }

    async function fetchCardsWithCurrentData() {
        let currentDataTmp = []
        for (let i = 0; i < userCards.length; i++) {
            let currentPlaneData = await getPlaneCurrentData(userCards[i].planeIcao24, userLocation)

            currentDataTmp.push({
                icao24: userCards[i].planeIcao24,
                userCardsIndex: i,
                manufacturer: userCards[i].planeManufacturer,
                model: userCards[i].planeModel,
                owner: userCards[i].planeOwner != undefined ? userCards[i].planeOwner : userCards[i].planeOperator,
                quality: userCards[i].cardQuality,
                distance: currentPlaneData.distance == undefined ? "Not in use" : currentPlaneData.distance,
                velocity: currentPlaneData.velocity,
                geometricAltitude: currentPlaneData.geometricAltitude
            })
        }
        setCardsWithCurrentData(currentDataTmp)
    }

    const getDataTableRow = (currentCard: Card, index: number) => {
        if (cardsWithCurrentData.includes(currentCard.planeIcao24) == false) {
            return (
                <DataTable.Row style={currentCard.distance == undefined ? styles.tableRowCardUnavailable : undefined} onPress={() => { props.navigation.navigate('Card', userCards[currentCard.userCardsIndex]) }}>
                    <DataTable.Cell style={styles.dataTableCell}>{currentCard.manufacturer}</DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{currentCard.model}</DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{currentCard.owner}</DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{currentCard.distance != "Not in use" ? parseInt(currentCard.distance) : null}<Text>{currentCard.distance != "Not in use" ? " km" : "Not in use"}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{currentCard.quality}</DataTable.Cell>
                </DataTable.Row>
            )
        }
    }

    const renderDataLoading = () => {
        return (
            <View style={styles.cardsListLoadding}>
                <Fold size={100} color="rgba(25, 58, 165, 1)" />
                <Text style={{ marginTop: 100, fontSize: 30 }}>Loading cards</Text>
            </View>
        )
    }

    const renderDataTable = () => {
        return (
            <SafeAreaView>
                <ScrollView horizontal>
                    <ScrollView>
                        <DataTable>

                            <DataTable.Header>
                                <DataTable.Title
                                    sortDirection={sortDirections.manufacturer}
                                    style={sortBy == "manufacturer" ? styles.columnTitleHighlighted : styles.columnTitleNormal}
                                    onPress={() => {
                                        sortDirections.manufacturer == "descending" ? setSortDirections({ ...sortDirections, manufacturer: "ascending" }) : setSortDirections({ ...sortDirections, manufacturer: "descending" })
                                        setSortBy("manufacturer")
                                    }}
                                >Manufacturer
                                </DataTable.Title>
                                <DataTable.Title
                                    sortDirection={sortDirections.model}
                                    style={sortBy == "model" ? styles.columnTitleHighlighted : styles.columnTitleNormal}
                                    onPress={() => {
                                        sortDirections.model == "descending" ? setSortDirections({ ...sortDirections, model: "ascending" }) : setSortDirections({ ...sortDirections, model: "descending" })
                                        setSortBy("model")
                                    }}
                                >Model
                                </DataTable.Title>
                                <DataTable.Title
                                    sortDirection={sortDirections.owner}
                                    style={sortBy == "owner" ? styles.columnTitleHighlighted : styles.columnTitleNormal}
                                    onPress={() => {
                                        sortDirections.owner == "descending" ? setSortDirections({ ...sortDirections, owner: "ascending" }) : setSortDirections({ ...sortDirections, owner: "descending" })
                                        setSortBy("owner")
                                    }}
                                >Operator/Owner
                                </DataTable.Title>
                                <DataTable.Title
                                    sortDirection={sortDirections.distance}
                                    style={sortBy == "distance" ? styles.columnTitleHighlighted : styles.columnTitleNormal}
                                    onPress={() => {
                                        sortDirections.distance == "ascending" ? setSortDirections({ ...sortDirections, distance: "descending" }) : setSortDirections({ ...sortDirections, distance: "ascending" })
                                        setSortBy("distance")
                                    }}
                                >Distance
                                </DataTable.Title>
                                <DataTable.Title
                                    sortDirection={sortDirections.quality}
                                    style={sortBy == "quality" ? styles.columnTitleHighlighted : styles.columnTitleNormal}
                                    onPress={() => {
                                        sortDirections.quality == "ascending" ? setSortDirections({ ...sortDirections, quality: "descending" }) : setSortDirections({ ...sortDirections, quality: "ascending" })
                                        setSortBy("quality")
                                    }}
                                >Card quality
                                </DataTable.Title>
                            </DataTable.Header>

                            {cardsWithCurrentData.map((card, index) => getDataTableRow(card, index))}

                        </DataTable>
                    </ScrollView>
                </ScrollView>
            </SafeAreaView>
        )
    }


    return (
        <View>
            {cardsWithCurrentData == undefined ? renderDataLoading() : renderDataTable()}
        </View>
    )
}