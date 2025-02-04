import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
    dashboard: (props)=> <AntDesign name="home" size={26} {...props} />,
    contacts: (props)=> <AntDesign name="pluscircleo" size={26} {...props} />,
    history: (props)=> <Feather name="compass" size={26} {...props} />,
    profile: (props)=> <AntDesign name="user" size={26} {...props} />,
}