import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import useShoppingLists from '@/hooks/useShoppingLists';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { screenComponent } from '@/util/navigation';
import { AddItemsFromListProps } from './AddItemsFromList';
import BaseText from '@/components/BaseText';

export interface AddItemsFromListsStartProps {
    addToListId: number;
}

const AddItemsFromListsStart: Screen<
    AddItemsFromListsStartProps & ScreenProps
> = (props) => {
    const shoppingLists = useShoppingLists();

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 50 }}>
                {shoppingLists.data
                    ?.filter((list) => list.id !== props.addToListId)
                    .map((list) => (
                        <TouchableOpacity
                            key={list.id.toString()}
                            onPress={() => {
                                Navigation.push(
                                    props.componentId,
                                    screenComponent<AddItemsFromListProps>(
                                        'AddItemsFromList',
                                        {
                                            passProps: {
                                                id: list.id,
                                                addToListId: props.addToListId,
                                            },
                                        },
                                    ),
                                );
                            }}>
                            <BaseText>{list.name}</BaseText>
                        </TouchableOpacity>
                    ))}
            </View>
        </ScrollView>
    );
};

export default AddItemsFromListsStart;
