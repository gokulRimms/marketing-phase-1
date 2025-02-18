import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { _NOTIFICATIONS_COUNT } from '../utility/models/notifications'
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import Pusher from "pusher-js/react-native";
import { FIRE_TOAST } from '../utility/helpers/toaster';
import { useToast } from "@/components/ui/toast";
import {PUSER_KEY} from '../constants/endpoints'
const Notification = (props) => {
  const user = props.user;
  const toast = useToast(); // Get toast instance

  const [notificationCount, setNotificationCount] = React.useState(0);

  React.useEffect(() => {
    fetCount();
  }, []);

  React.useEffect(() => {
    const pusher = new Pusher(PUSER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("notifications");

    channel.bind("App\\Events\\NewNotification", (event) => {
      console.log('event triggered', event);
      if (event.data.action == 'NOTIFICATION_SUCCESS' && event.data.user_id == user?.id)
        FIRE_TOAST(toast, "info", "solid", "Success", 'New Notification', event.data.message);
      fetCount();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const fetCount = async () => {
    console.log('fetching notification count');
    await _NOTIFICATIONS_COUNT().then((response) => {
      setNotificationCount(response.data.data);
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <TouchableOpacity
      onPress={() => {
        fetCount();
        router.push("/notifications");
      }}
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