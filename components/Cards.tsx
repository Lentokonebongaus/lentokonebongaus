import { Text, View, FlatList, Image} from "react-native";
import testCard from '../testCard';
import star from "../assets/star4.png";
import star2 from "../assets/2star.png";
import star3 from "../assets/3star.png";
import star4 from "../assets/4star.png";
import star5 from "../assets/5star.png";
import { styles } from '../util/styles';

export default function Cards(){

    // for testing purposes
    let manyCardsTest = [testCard, testCard, testCard, testCard]; 
    
    // TODO: prettier cards, sorting, single card view?
    return (
        <View style={{padding: 20}}>

          <FlatList 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={ ({item}) => 
            <View style={styles.horizontalCard}>

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
