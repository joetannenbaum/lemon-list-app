import React from 'react';
import {
    TouchableOpacity,
    Image,
    ImageSourcePropType,
    StyleSheet,
} from 'react-native';
import BaseText from './BaseText';
import { flexCenter, bsl, sizeImage } from '@/util/style';

export interface FooterToolButtonProps {
    onPress: () => void;
    icon: ImageSourcePropType;
    iconWidth: number;
    iconHeight?: number;
}

const FooterToolButton: React.FC<FooterToolButtonProps> = (props) => {
    return (
        <TouchableOpacity style={styles.tool} onPress={props.onPress}>
            <Image
                source={props.icon}
                style={[
                    styles.icon,
                    sizeImage(
                        props.iconWidth,
                        props.iconHeight || props.iconWidth,
                        {
                            height: 40,
                        },
                    ),
                ]}
            />
            <BaseText size={20} bold={true}>
                {props.children.toUpperCase()}
            </BaseText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tool: {
        ...flexCenter,
    },
    icon: {
        marginBottom: bsl(15),
    },
});

export default FooterToolButton;
