import { View, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from '@/constants/colors';
const Loader = ({ size, color }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size || "large"} color={color || colors.primary} />
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});