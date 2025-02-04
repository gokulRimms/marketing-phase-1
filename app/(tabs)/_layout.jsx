import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import BottomNavigation from '@/components/BottomNavigation'

const _layout = () => {
  return (
    <Tabs
        tabBar={props=> <BottomNavigation {...props} />}
    >
        <Tabs.Screen
            name="dashboard"
            options={{
                title: "Dashboard"
            }}
        />
        <Tabs.Screen
            name="explore"
            options={{
                title: "Explore"
            }}
        />
        <Tabs.Screen
            name="create"

            options={{
                title: "Create",
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile"
            }}
        />
    </Tabs>
  )
}

export default _layout