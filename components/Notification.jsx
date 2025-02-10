import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {_NOTIFICATIONS_COUNT} from '../utility/models/notifications'
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

const Notification = (props) => {
    const user = props.user;

    const [notificationCount, setNotificationCount] = React.useState(0);

    React.useEffect(() => {
        fetCount();
    }, []);

    const fetCount = async() => {
        console.log('fetching notification count');
       await _NOTIFICATIONS_COUNT().then((response) => {
            setNotificationCount(response.data.data);
        }).catch((error) => {
            console.log(error);
        });
    };

  return (
   <TouchableOpacity
               onPress={() => router.push("/notifications")}
               style={{
                 marginRight: 10,
                 borderColor: "white",
                 borderWidth: 1,
                 padding: 5,
                 borderRadius: 10,
                 position: "relative",
               }}
             >
               <Ionicons name="notifications" size={24} color="white" />
   
               {/* Notification Badge */}
               {notificationCount > 0 && (
                 <View
                   style={{
                     position: "absolute",
                     top: -2,
                     right: -2,
                     backgroundColor: "red",
                     borderRadius: 10,
                     paddingHorizontal: 6,
                     paddingVertical: 2,
                     minWidth: 20,
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Text style={{ color: "white", fontSize: 8, fontWeight: "bold" }}>{notificationCount}</Text>
                 </View>
               )}
             </TouchableOpacity>
  )
}

export default Notification