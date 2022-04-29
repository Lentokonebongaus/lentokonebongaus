import { Text, View, SafeAreaView, ScrollView, Button, Image, Alert } from "react-native";
import { styles } from '../util/styles';
import { useContext, useEffect, useState } from "react"
import { Button as KittenButton, Icon, Layout, Spinner } from '@ui-kitten/components';
import { DataTable } from 'react-native-paper';
import { UserCardsContext } from "../util/UserCardsProvider";
import { UserLocationContext } from '../util/UserLocationProvider';
import { getPlaneCurrentData } from '../util/locationFunctions';

export default function CardsList(props:any){

    const { userCards, setUserCards } = useContext(UserCardsContext)
    const { userLocation, setUserLocation } = useContext(UserLocationContext)

    const [cardsCurrentData, setCardsCurrentData] = useState(undefined)

    useEffect(()=>{
        fetchCardsCurrentData()
    },[])
    const styles={
        cardsArea:{
            flex: 1,
            border: "solid",
            borderWidth: 2,
            borderColor: "red",
            height: "100%",
            width: "100%",
            flexDirection: "column"
        },
        tableRowCardUnavailable:{
            backgroundColor: "lightgray",
        },
        tableRowCardAvailable:{
        },
        dataTableCell:{
            width: 100
        },
        dataTableTitle:{
            width: 100
        }
    }

    async function fetchCardsCurrentData(){
        let currentDataTmp = []
        for(let i = 0; i < userCards.length; i++){
            let currentPlaneData = await getPlaneCurrentData(userCards[i].planeIcao24, userLocation)
            
            currentDataTmp.push({icao24:userCards[i].planeIcao24, distance:currentPlaneData.distance, velocity:currentPlaneData.velocity, geometricAltitude:currentPlaneData.geometricAltitude})
        }
        setCardsCurrentData(currentDataTmp)
    }

    const getDataTableRow = (card:Card, index:number) =>{
        if(userCards.includes(card.planeIcao24) == false){
            return(
                <DataTable.Row style={cardsCurrentData[index].distance==undefined?styles.tableRowCardUnavailable:undefined} onPress={()=>{props.navigation.navigate('Card', userCards[index])}}>
                    <DataTable.Cell style={styles.dataTableCell}><Text style={cardsCurrentData[index].distance==undefined?undefined:{color:"lime"}}>{cardsCurrentData[index].distance==undefined?"No":"Yes"}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{card.planeManufacturer}</DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{card.planeModel}</DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{card.planeOwner?card.planeOwner:card.planeOperator}</DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{card.cardQuality}</DataTable.Cell>
                    <DataTable.Cell style={styles.dataTableCell}>{cardsCurrentData[index].distance?parseInt(cardsCurrentData[index].distance):null}<Text>{cardsCurrentData[index].distance!=undefined?" km":null}</Text></DataTable.Cell>
                </DataTable.Row>
            )
        }
    }

    const renderDataTable = () =>{
        return(
            <SafeAreaView>
                <ScrollView horizontal>
                    <ScrollView>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.dataTableTitle}>In use</DataTable.Title>
                                <DataTable.Title style={styles.dataTableTitle}>Manufacturer</DataTable.Title>
                                <DataTable.Title style={styles.dataTableTitle}>Model</DataTable.Title>
                                <DataTable.Title style={styles.dataTableTitle}>Operator</DataTable.Title>
                                <DataTable.Title style={styles.dataTableTitle}>Card quality</DataTable.Title>
                                <DataTable.Title style={styles.dataTableTitle}>Distance</DataTable.Title>
                            </DataTable.Header>
                            {userCards.map((card, index)=>getDataTableRow(card, index))}
                        </DataTable>
                    </ScrollView>
                </ScrollView>
            </SafeAreaView>
        )
    }


    return(
        <View>
            {cardsCurrentData==undefined?null:renderDataTable()}
        </View>
    )
}