import { Text, View, FlatList, Image} from "react-native";
import testCard from '../testCard';
import star from "../star4.png";
import star2 from "../2star.png";
import star3 from "../3star.png";
import star4 from "../4star.png";
import star5 from "../5star.png";

export default function Cards(){

    // for testing purposes
    let manyCardsTest = [testCard, testCard, testCard, testCard]; 

    //"graphic design is my passion"
    // TODO: prettier cards, sorting
    return (
        <View style={{padding: 20}}>

          <FlatList 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={ ({item}) => 
            <View style={styles.horizontal}>

                <View style={styles.card}>

                <Text style={styles.cardTextHeader}>{item.planeModel}</Text>
                
                {item.planePicture != ""?  <Image
                source={{uri: item.planePicture}}/>: null }

                {item.cardQuality < 5?  <Image
                source={star5}/>: null }
                {item.cardQuality < 100 && item.cardQuality > 5? <Image
                source={star4}/>: null }
                {item.cardQuality < 500 && item.cardQuality > 100? <Image
                source={star3}/>: null }
                {item.cardQuality < 1000 && item.cardQuality > 500? <Image
                source={star2}/>: null }
                {item.cardQuality > 1000? <Image
                source={star}/>: null }

                <Text style={styles.cardText}>Manufacturer: {item.planeManufacturer}</Text>
                <Text style={styles.cardText}>Model: {item.planeModel}</Text>
                <Text style={styles.cardText}>Operator: {item.planeOperator}</Text>
                <Text style={styles.cardText}>Operator CallSign: {item.planeOperatorCallSign}</Text>
                <Text style={styles.cardText}>Owner: {item.planeOwner}</Text>

                </View>


            </View> }
            data={manyCardsTest}
          />
        </View>
      );

}

const styles = {
    horizontal: {
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent:'space-around',
      padding: 20
    },
    horizontalMargin: {
      flexDirection: 'row',
      alignItems: 'flex-start', 
      justifyContent:'space-around',
      margin: 10,
    }, 
    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        backgroundColor: '#75c9fa', 
        borderRadius: 5, 
        borderWidth: 5,
        borderColor: "#0285d1",
        padding: 20, 
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8
    }, 
    cardText: {
        fontSize: 15, 
        color: "#005485"
    }, 
    cardTextHeader: {
        fontSize: 20, 
        color: "#00273d", 
        fontWeight: "bold"

    }
}
