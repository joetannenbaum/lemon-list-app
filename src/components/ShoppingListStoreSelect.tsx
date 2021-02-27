import React from 'react';
import {
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    View,
} from 'react-native';
import BaseText from '@/components/BaseText';
import asModal, { asModalExportedProps, asModalProps } from './asModal';
import CancelButton from './form/CancelButton';
import { bsl, sizeImage } from '@/util/style';
import Divider from './Divider';
import useStores from '@/hooks/useStores';
import ArrowButton from './ArrowButton';

export interface ShoppingListStoreSelectProps {
    addToListId: number;
    onSelect: (storeId: number | null) => void;
}

const ShoppingListStoreSelect: React.FC<
    ShoppingListStoreSelectProps & asModalExportedProps & asModalProps
> = (props) => {
    const stores = useStores();

    return (
        <>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={[
                    {
                        id: null,
                        name: 'No Store',
                    },
                ].concat(stores.data)}
                keyExtractor={(item) =>
                    item.id === null ? 'none' : item.id.toString()
                }
                ItemSeparatorComponent={() => (
                    <View style={styles.divider}>
                        <Divider />
                    </View>
                )}
                renderItem={({ item }) => (
                    <ArrowButton
                        onPress={() => {
                            props.onSelect(item.id);
                            props.dismiss();
                        }}>
                        {item.name}
                    </ArrowButton>
                )}
            />
            <CancelButton onPress={props.dismiss} />
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: bsl(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    carat: sizeImage(16, 24, { width: 16 }),
    textWrapper: {
        flex: 1,
        paddingRight: bsl(20),
    },
    divider: {
        marginVertical: bsl(20),
    },
});

export default asModal(ShoppingListStoreSelect);
