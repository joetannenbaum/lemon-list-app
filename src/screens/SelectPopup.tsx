import React from 'react';
import { Screen, SelectItem } from '@/types/navigation';
import asModal from '@/components/asModal';
import { ModalScreenProps } from '@/types/navigation';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import BaseText from '@/components/BaseText';
import { bsl } from '@/util/style';
import Divider from '@/components/Divider';

export interface SelectPopupProps {
    items: SelectItem[];
    selected: string | null | undefined;
    onSelect: (item: SelectItem | null) => void;
}

const SelectPopup: Screen<SelectPopupProps & ModalScreenProps> = (props) => {
    const onPress = (val: SelectItem | null) => {
        props.onSelect(val);
        props.dismiss();
    };
    return (
        <View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.list}>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => onPress(null)}>
                    <BaseText
                        align="center"
                        bold={
                            props.selected === '' ||
                            props.selected === null ||
                            typeof props.selected === 'undefined'
                        }>
                        No Selection
                    </BaseText>
                </TouchableOpacity>
                {props.items.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={styles.item}
                        onPress={() => onPress(item)}>
                        <BaseText
                            align="center"
                            bold={item.value === props.selected}>
                            {item.label}
                        </BaseText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Divider />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingVertical: bsl(10),
    },
    list: {
        maxHeight: bsl(500),
    },
});

export default asModal(SelectPopup);
