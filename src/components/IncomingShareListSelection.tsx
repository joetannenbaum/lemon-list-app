import React from 'react';
import { useField } from 'formik';
import useShoppingLists from '@/hooks/useShoppingLists';
import BaseText from './BaseText';

export interface IncomingShareListSelectionProps {}

const IncomingShareListSelection: React.FC<IncomingShareListSelectionProps> = (
    props,
) => {
    const [listId] = useField('listId');
    const [newName] = useField('newListName');

    const lists = useShoppingLists();

    const selectedList = lists.data?.find((list) => list.id === listId.value);

    if (typeof selectedList !== 'undefined') {
        return (
            <BaseText>
                Importing into:{' '}
                <BaseText bold={true}>{selectedList.name}</BaseText>
            </BaseText>
        );
    }

    if (newName.value.trim() !== '') {
        return (
            <BaseText>
                Importing into: <BaseText bold={true}>{newName.value}</BaseText>
            </BaseText>
        );
    }

    return <BaseText>Choose List</BaseText>;
};

export default IncomingShareListSelection;
