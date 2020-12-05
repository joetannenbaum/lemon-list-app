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
            style={[
                styles.button,
                {
                    backgroundColor: props.checked ? '#6EE7B7' : 'transparent',
                    borderColor: props.checked ? '#6EE7B7' : black,
                },
            ]}
            onPress={props.onPress}>
            {props.checked && (
                <Image
                    source={require('@images/check.png')}
                    style={styles.checkIcon}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        ...flexCenter,
        borderRadius: bsl(35),
        width: bsl(35),
        height: bsl(35),
        borderWidth: bsl(1),
    },
    checkIcon: {
        tintColor: '#fff',
        ...sizeImage(35, 29, { width: bsl(25) }),
    },
});

export default Checkbox;
