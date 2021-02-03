import React from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BaseText from '@/components/BaseText';
import { View, Button, Alert } from 'react-native';
import useUpdateShoppingListItem from '@/hooks/useUpdateShoppingListItem';
import useDeleteShoppingListItem from '@/hooks/useDeleteShoppingListItem';
import { Formik, FormikHelpers } from 'formik';
import TextField from '@/components/form/TextField';
import * as Yup from 'yup';
import { Navigation } from 'react-native-navigation';
import { ScreenProps, Screen } from '@/types/navigation';
import SubmitButton from '@/components/form/SubmitButton';
import SafeAreaView from 'react-native-safe-area-view';
import Select from '@/components/form/Select';
import useStores from '@/hooks/useStores';
import sortBy from 'lodash/sortBy';
import useUpdateItem from '@/hooks/useUpdateItem';
import omit from 'lodash/omit';
import AutoGrowTextField from '@/components/form/AutoGrowTextField';
import QuantityControlField from '@/components/QuantityControlField';

export interface EditShoppingListItemProps {
    listId: number;
    item: ShoppingListItemType;
}

interface FormValues {
    name: string;
    quantity: number;
    store_tags:
        | {
              [key: number]: number | undefined;
          }
        | undefined;
    note: string;
}

const EditShoppingListItem: Screen<EditShoppingListItemProps & ScreenProps> = (
    props,
) => {
    const stores = useStores();

    const { mutate: updateShoppingListItem } = useUpdateShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const { mutate: updateItem } = useUpdateItem(props.item.item.id);

    const { mutate: deleteItem } = useDeleteShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const initialFormValues: FormValues = {
        name: props.item.item.name,
        quantity: props.item.quantity,
        store_tags: stores.data?.reduce(
            (prev, current) => ({
                ...prev,
                [current.id]: props.item.item.store_tags.find(
                    (tag) => tag.store_id === current.id,
                )?.id,
            }),
            {},
        ),
        note: props.item.note || '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        quantity: Yup.number().required('Required').min(1),
        note: Yup.string().nullable(),
    });

    const onSubmit = (values: FormValues, form: FormikHelpers<FormValues>) => {
        Promise.all([
            updateShoppingListItem(omit(values, 'store_tags')),
            // TODO: The item ID might have changed, we should check this out
            updateItem({
                store_tags: Object.values(values.store_tags),
            }),
        ]).then(() => {
            Navigation.dismissModal(props.componentId);
        });
    };

    const onDeletePress = () => {
        Alert.alert(
            'Delete?',
            `Are you sure you want to delete ${props.item.item.name} from the list?`,
            [
                {
                    text: 'Cancel',
                },
                {
                    style: 'destructive',
                    text: 'Delete',
                    onPress() {
                        deleteItem().then(() => {
                            Navigation.dismissModal(props.componentId);
                        });
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView>
            <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                    <View style={{ padding: 50 }}>
                        <TextField
                            required={true}
                            name="name"
                            placeholder="Item"
                            onSubmitEditing={handleSubmit}
                        />

                        <View
                            style={{
                                paddingTop: 20,
                            }}>
                            <QuantityControlField name="quantity" />
                        </View>
                        <View style={{ padding: 20 }}>
                            {stores.data
                                ?.filter((store) => store.tags.length > 0)
                                .map((store) => (
                                    <View key={store.id.toString()}>
                                        <BaseText bold={true}>
                                            {store.name}
                                        </BaseText>
                                        <Select
                                            name={`store_tags.${store.id}`}
                                            items={sortBy(
                                                store.tags,
                                                'name',
                                            ).map((tag) => ({
                                                label: tag.name,
                                                value: tag.id,
                                            }))}
                                        />
                                    </View>
                                ))}
                        </View>
                        <View style={{ padding: 20 }}>
                            <AutoGrowTextField
                                name="note"
                                maxLength={200}
                                placeholder="Add a note"
                            />
                        </View>
                        <View style={{ padding: 20 }}>
                            <Button
                                color="red"
                                title="Delete"
                                onPress={onDeletePress}
                            />
                        </View>
                        <SubmitButton
                            disabled={values.name === ''}
                            onPress={handleSubmit}
                            processing={isSubmitting}>
                            Update
                        </SubmitButton>
                        <View style={{ padding: 20 }}>
                            <Button
                                color="grey"
                                title="Cancel"
                                onPress={() => {
                                    Navigation.dismissModal(props.componentId);
                                }}
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default EditShoppingListItem;
