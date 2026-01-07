import React, {memo, useMemo} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Colors} from '../constants';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  textColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  textColor = Colors.button.primary.text,
  backgroundColor = Colors.button.primary.background,
  style,
}) => {
  const buttonStyle = useMemo(
    () => [styles.button, {backgroundColor}, style],
    [backgroundColor, style],
  );

  const textStyle = useMemo(
    () => [styles.buttonText, {color: textColor}],
    [textColor],
  );

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default memo(CustomButton);
