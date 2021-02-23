import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { bsl, flexCenter, sizeImage, black } from '@/util/style';

export interface CheckboxProps {
    checked: boolean;
    onPress: () => void;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={props.onPress}
            hitSlop={{
                top: bsl(10),
                bottom: bsl(10),
                left: bsl(10),
                right: bsl(10),
            }}>
            {!props.checked && (
                <Image
                    source={require('@images/check-circle.png')}
                    style={styles.checkIcon}
                />
            )}
            {props.checked && (
                <Image
                    source={require('@images/checked.png')}
                    style={styles.checkIcon}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        ...flexCenter,
    },
    checkIcon: {
        ...sizeImage(10, 10, { width: bsl(70) }),
    },
});

export default Checkbox;
