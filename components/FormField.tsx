import { FC, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import { icons } from "../constants";

type FormFieldTypes = {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  inputStyle?: string;
};

const FormField: FC<FormFieldTypes> = ({
  title,
  value,
  placeholder = "",
  keyboardType = "default",
  handleChangeText,
  otherStyles = "",
  inputStyle = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container]}>
      <Text style={styles.label}>{title}</Text>

      <View style={[styles.inputContainer]}>
        <TextInput
          style={styles.textInput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          secureTextEntry={title === "Password" && !showPassword}
          editable={true}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginTop: 16
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C34",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 1,
    height: 55,
  },
  textInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    textDecorationLine: 'none'
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default FormField;
