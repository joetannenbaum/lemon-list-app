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
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            props.onSelect(item.id);
                            props.dismiss();
                        }}>
                        <View style={styles.textWrapper}>
                            <BaseText>{item.name}</BaseText>
                        </View>
                        <Image
                            source={require('@images/carat-right.png')}
                            style={styles.carat}
                        />
                    </TouchableOpacity>
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
