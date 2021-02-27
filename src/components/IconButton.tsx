import React from 'react';
import { ImageSourcePropType, Image, StyleSheet } from 'react-native';
import BaseText from './BaseText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { bsl, yellow100, sizeImage } from '@/util/style';

export interface IconButtonProps {
    icon: ImageSourcePropType;
    onPress: () => void;
    iconWidth: number;
    iconHeight: number;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
    return (
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
            <Image
                style={[
                    styles.icon,
                    sizeImage(props.iconWidth, props.iconHeight, {
                        height: 40,
                    }),
                ]}
                source={props.icon}
            />
            <BaseText>{props.children}</BaseText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: yellow100,
        paddingHorizontal: bsl(20),
        paddingVertical: bsl(20),
        borderRadius: bsl(200),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginRight: bsl(20),
    },
});

export default IconButton;
