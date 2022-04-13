import { Text, View, FlatList, Image, TouchableOpacity} from "react-native";
import testCard from '../testCard';
import { styles } from '../util/styles';
import { AntDesign } from '@expo/vector-icons'; 

type Props = {
    navigation: any
  }

export default function Cards(Props: Props){

    // for testing purposes
    let manyCardsTest = [testCard, testCard, testCard, testCard]; 
    
    // sorting ? 
    return (
        <View style={{padding: 20}}>

          <FlatList 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={ ({item}) => 
            <View style={styles.horizontalCard}>

            <TouchableOpacity style={styles.card} 
            onPress={ () => Props.navigation.navigate('Card')}>

                <Text style={styles.cardTextHeader}>{item.planeModel}</Text>
                
                {item.planePicture != ""?  <Image
                source={{uri: item.planePicture}}/>: null }

                {item.cardQuality < 5? 
                <Text>
                     {Array.from({ length: 5 }, (_, i) => 
                    <AntDesign name="star" size={24} color="gold" />)}
                </Text>: null }
                {item.cardQuality < 100 && item.cardQuality > 5? 
                <Text>
                     {Array.from({ length: 4 }, (_, i) => 
                    <AntDesign name="star" size={24} color="orange" />)}
                </Text>: null }
                {item.cardQuality < 500 && item.cardQuality > 100? <Text>
                    {Array.from({ length: 3 }, (_, i) => 
                    <AntDesign name="star" size={24} color="#c4c4c4" />)}
                </Text>: null }
                {item.cardQuality < 1000 && item.cardQuality > 500? 
                <Text>
                 {Array.from({ length: 2 }, (_, i) => 
                    <AntDesign name="star" size={24} color="#c41c10" />)}
                </Text>
                : null }
                {item.cardQuality > 1000? 
                <AntDesign name="star" size={24} color="white" />: null }

                <Text style={styles.cardText}>Manufacturer: {item.planeManufacturer}</Text>
                <Text style={styles.cardText}>Model: {item.planeModel}</Text>
                <Text style={styles.cardText}>Operator: {item.planeOperator}</Text>
                <Text style={styles.cardText}>Operator CallSign: {item.planeOperatorCallSign}</Text>
                <Text style={styles.cardText}>Owner: {item.planeOwner}</Text>

                </TouchableOpacity>


            </View> }
            data={manyCardsTest}
          />
        </View>
      );

}
