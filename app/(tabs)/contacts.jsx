import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

export default function blog() {
  return (
    <View>
      <Text>contacts</Text>
      <TouchableOpacity onPress={() => router.replace("/(pages)/policy")}>
        <Text>Privacy Policy</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => router.replace("/(blogs)/bloglist")}>
        <Text>Blogs</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => router.replace("/(blogs)/12")}>
        <Text>Blog details</Text>
      </TouchableOpacity> */}
    </View>
  )
}