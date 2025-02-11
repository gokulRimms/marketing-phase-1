import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

export const icons = {
    dashboard: (props)=> <AntDesign name="home" size={26} {...props} />,
    contacts: (props)=> <AntDesign name="contacts" size={26} {...props} />,
    history: (props)=> <MaterialIcons name="history" size={26} {...props} />,
    profile: (props)=> <AntDesign name="user" size={26} {...props} />,
    groups : (props)=> <AntDesign name="team" size={26} {...props} />,
    leads : (props)=> <Feather name="briefcase" size={26} {...props} />,
}