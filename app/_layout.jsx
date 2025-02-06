import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Tabs } from "expo-router/tabs";
import Header from "@/components/Header";
import "../global.css"

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack screenOptions={{ headerShown: false, animationEnabled: true, gestureEnabled: true }}>
        <Stack.Screen name="(auth)/login" options={{ title: "Login", headerShown: false, header: () => <Header title='Login' profile={false} /> }} />
        <Stack.Screen name="(tabs)/_layout" options={{ title: "Main" }} />
        <Stack.Screen name="(pages)/policy" options={{ title: "Privacy Policy", headerShown: true, header: () => <Header title='Privacy Policy' profile={false} /> }} />
        <Stack.Screen name="(blogs)/bloglist" options={{ title: "Blogs List", headerShown: true, header: () => <Header title='Blogs List' profile={false} /> }} />

      </Stack>
    </GluestackUIProvider>
  );
}
