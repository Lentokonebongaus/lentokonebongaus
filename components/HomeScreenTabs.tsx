import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons} from '@expo/vector-icons';  
import Kotinakyma from './Kotinakyma';
import Map from './Map';
import ListPlanes from './ListPlanes';

const Tab = createBottomTabNavigator();

export default function HomeScreenTabs(){
    
    return (
        <Tab.Navigator
        screenOptions={({route }) => ({ 
        tabBarIcon: ({ focused, color, size }) => {             
                
            let iconName;            
            if (route.name === 'Home') {             
                iconName = 'md-home';            
            } else if (route.name === 'Map') {
                iconName = 'md-map';            
            }
            // näyttää punaista mutta toimii
            return <Ionicons name={iconName}size={size}color={color} />;   
                
        },
        headerShown: false         
        })}>
            <Tab.Screen name="Home" component={Kotinakyma} />
            <Tab.Screen name="Map" component={Map} />
            <Tab.Screen name="List" component={ListPlanes} />
        </Tab.Navigator>
      );
}