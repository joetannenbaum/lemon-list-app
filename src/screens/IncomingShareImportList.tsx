import React, { useCallback } from 'react';
import { ScreenProps, Screen } from '@/types';
import asModal from '@/components/asModal';
import { View, FlatList } from 'react-native';
import TextField from '@/components/form/TextField';
import useShoppingLists from '@/hooks/useShoppingLists';
import CancelButton from '@/components/form/CancelButton';
import Divider from '@/components/Divider';
import ArrowButton from '@/components/ArrowButton';
import { ShoppingList } from '@/types/ShoppingList';
import { ModalScreenProps } from '@/types/navigation';
import { Formik, FormikHelpers } from 'formik';
import SubmitButton from '@/components/form/SubmitButton';

export interface IncomingShareImportListProps {
    name: string;
    onSelect: (listId: number) => void;
    onNewName: (name: string) => void;
}

interface FormValues {
    name: string;
}

const IncomingShareImportList: Screen<
    IncomingShareImportListProps & ModalScreenProps
> = (props) => {
    const lists = useShoppingLists();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingList }) => (
            <ArrowButton
                onPress={() => {
                    props.onSelect(item.id);
                    props.dismiss();
                }}>
                {item.name}
            </ArrowButton>
        ),
        [],
    );

    const onSubmit = useCallback(
        (values: FormValues, form: FormikHelpers<FormValues>) => {
            props.onNewName(values.name);
            props.dismiss();
        },
        [],
    );

    return (
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={lists.data}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <Divider margin={20} />}
                renderItem={renderItem}
            />

            <Formik
                onSubmit={onSubmit}
                initialValues={{
                    name: props.name,
                }}>
                {({ handleSubmit, isSubmitting }) => (
                    <>
                        <TextField name="name" placeholder="New List" />
                        <SubmitButton
                            onPress={handleSubmit}
                            processing={isSubmitting}>
                            Add List
                        </SubmitButton>
                    </>
                )}
            </Formik>

            <CancelButton onPress={props.dismiss} />
        </View>
    );
};

export default asModal(IncomingShareImportList);
