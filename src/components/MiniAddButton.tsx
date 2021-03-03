import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { bsl, sizeImage } from '@/util/style';
import Processing from './Processing';

export interface MiniAddButtonProps {
    submitting: boolean;
    onPress: () => void;
    disabled?: boolean;
}

const MiniAddButton: React.FC<MiniAddButtonProps> = (props) => {
    return (
        <TouchableOpacity
            style={styles.addButton}
            onPress={props.onPress}
            disabled={props.disabled}>
            {props.submitting ? (
                <Processing />
            ) : (
                <Image
                    source={require('@images/plus-circle.png')}
                    style={styles.addIcon}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        right: bsl(20),
        top: bsl(20),
        ...sizeImage(10, 10, { width: 40 }),
    },
    addIcon: sizeImage(76, 78, { width: 40 }),
});

export default MiniAddButton;
