import React from 'react';
import useShoppingLists from '@/hooks/useShoppingLists';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { screenComponent } from '@/util/navigation';
import BaseText from '@/components/BaseText';
import asModal, { asModalExportedProps, asModalProps } from './asModal';

export interface AddItemsFromListsStartProps {
    addToListId: number;
}

const AddItemsFromListsStart: React.FC<
    AddItemsFromListsStartProps & asModalExportedProps & asModalProps
> = (props) => {
    const shoppingLists = useShoppingLists();

    return (
        <ScrollView>
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
        </ScrollView>
    );
};

export default asModal(AddItemsFromListsStart);
