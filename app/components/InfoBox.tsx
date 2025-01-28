import { View, Text } from "react-native";
import React, { FC } from "react";

type InfoBoxProps = {
  title: string;
  subtitle?: string;
  containerStyle?: string;
  titleStyle: string;
};

const InfoBox: FC<InfoBoxProps> = ({
  title,
  subtitle,
  containerStyle,
  titleStyle,
}) => {
  return (
    <View className={containerStyle}>
      <Text className={`text-white text-center font-psemibold${titleStyle}`}>
        {title}
      </Text>
      <Text className={`text-sm text-gray-100 text-center font-pregular`}>
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
