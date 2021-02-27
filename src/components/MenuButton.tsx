import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { showMenu } from '@/util/navigation';
import { sizeImage } from '@/util/style';

export interface MenuButtonProps {}

const MenuButton: React.FC<MenuButtonProps> = (props) => {
    return (
        <TouchableOpacity onPress={showMenu}>
            <Image style={styles.image} source={require('@images/menu.png')} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    image: sizeImage(80, 62, { width: 40 }),
});

export default MenuButton;
