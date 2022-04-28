import { Text, View, Image } from "react-native";
import { useState } from "react";
import { styles } from '../util/styles';
import { AntDesign } from '@expo/vector-icons';
import Draggable from "react-native-draggable";
import { Card } from 'react-native-elements';
import { animated, config } from "react-spring";
import { glow } from "../util/cardGlow";

type Props = {
  route: any
}

const AnimatedIcon = animated(AntDesign);

export default function CardView(Props: Props) {

  const [cardFlip, setCardFlip] = useState(false)

  let gold = glow(10, 40, "gold", cardFlip, setCardFlip);
  let orange = glow(10, 30, "orange", cardFlip, setCardFlip);
  // FIXME: weird flicker with 3 stars
  let grey = glow(10, 15, "#c4c4c4", cardFlip, setCardFlip);

  let card = Props.route.params;

  return (
    <View style={{ padding: 20 }}>

      <Draggable x={20} y={150}>

        <Card containerStyle={{ backgroundColor: "#333C83", paddingHorizontal: 20 }}
          wrapperStyle={{ backgroundColor: "#333C83" }}>

          <Card.Title style={styles.cardTextHeader}>{card.planeModel}</Card.Title>

          {card.cardQuality < 5 ?
            <Text style={{ textAlign: "center", paddingBottom: 10 }}>
              {Array.from({ length: 5 }, (_, i) =>
                <AnimatedIcon name="star" size={24} color="gold" style={gold} />)}
            </Text> : null}
          {card.cardQuality < 100 && card.cardQuality > 5 ?
            <Text style={{ textAlign: "center", paddingBottom: 10 }}>
              {Array.from({ length: 4 }, (_, i) =>
                <AnimatedIcon name="star" size={24} color="orange" style={orange} />)}
            </Text> : null}
          {card.cardQuality < 500 && card.cardQuality > 100 ?
            <Text style={{ textAlign: "center", paddingBottom: 10 }}>
              {Array.from({ length: 3 }, (_, i) =>
                <AnimatedIcon name="star" size={24} color="#c4c4c4" style={grey} />)}
            </Text> : null}
          {card.cardQuality < 1000 && card.cardQuality > 500 ?
            <Text style={{ textAlign: "center", paddingBottom: 10 }}>
              {Array.from({ length: 2 }, (_, i) =>
                <AntDesign name="star" size={24} color="#c41c10" />)}
            </Text>
            : null}
          {card.cardQuality > 1000 ?
            <Text style={{ textAlign: "center", paddingBottom: 10 }}>
              <AntDesign name="star" size={24} color="white" /></Text> : null}

          <Card.Divider />

          {card.planePicture != "" ? <Image
            source={{ uri: card.planePicture }} style={{ width: 300, height: 200, alignSelf: "center" }} /> : null}

          <Card.Divider style={{ padding: 10 }} />
          <Text style={styles.cardText}>Manufacturer: {card.planeManufacturer}</Text>
          <Text style={styles.cardText}>Model: {card.planeModel}</Text>
          <Text style={styles.cardText}>Operator: {card.planeOperator}</Text>
          <Text style={styles.cardText}>Operator CallSign: {card.planeOperatorCallSign}</Text>
          <Text style={styles.cardText}>Owner: {card.planeOwner}</Text>

        </Card>
      </Draggable>
    </View>
  );

}