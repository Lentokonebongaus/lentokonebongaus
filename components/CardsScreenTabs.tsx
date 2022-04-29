import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons} from '@expo/vector-icons';  
import Kotinakyma from './Kotinakyma';
import Map from './Map';
import ListPlanes from './ListPlanes';
import Cards from './Cards';
import CardsList from './CardsList';

const Tab = createBottomTabNavigator();

export default function CardscreenTabs(){
    
    return (
        <Tab.Navigator
        screenOptions={({route }) => ({ 
        tabBarIcon: ({ focused, color, size}) => {             
                
            let iconName;            
            if (route.name === 'Cards') {             
                iconName = 'md-home';            
            } else if (route.name === 'Listed') {
                iconName = 'md-map';            
            } 
            // näyttää punaista mutta toimii
            return <Ionicons name={iconName}size={size}color={color} />;  
             
                
        },
        tabBarStyle: {
            backgroundColor: "rgba(25, 58, 165, 1)"
        },
        tabBarActiveTintColor: "#9af5e7", 
        tabBarInactiveTintColor: "white",
        headerShown: false         
        })}>
            <Tab.Screen name="Cards" component={Cards} />
            <Tab.Screen name="Listed" component={CardsList} />
        </Tab.Navigator>
      );
}