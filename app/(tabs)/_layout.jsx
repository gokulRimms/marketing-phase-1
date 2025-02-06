import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import BottomNavigation from '@/components/BottomNavigation'
import Header from '@/components/Header'
import { AuthProvider } from "@/context/AuthContext"; // Import Auth Context
const _layout = () => {

    return (
        <AuthProvider>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    header: (...props) => <Header profile={true} {...props} />,
                }}
                tabBar={props => <BottomNavigation {...props} />}

            >
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: "Dashboard",
                    }}
                />
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: "Explore"
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile"
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: "History"
                    }}
                />
                <Tabs.Screen
                    name="contacts"
                    options={{
                        title: "Contacts"
                    }}
                />
            </Tabs>
        </AuthProvider>
    )
}


const getTabTitle = (routeName) => {
    const titles = {
        dashboard: "Dashboard Overview",
        explore: "Discover New Content",
        create: "Create Your Own Content",
        profile: "Your Profile"

    };

    return titles[routeName] || "App"; // Default title
};
export default _layout