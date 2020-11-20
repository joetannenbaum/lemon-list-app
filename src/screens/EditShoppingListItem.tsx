import React from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BodyText from '@/components/BodyText';
import { View, Button, Alert, TouchableOpacity } from 'react-native';
import useUpdateShoppingListItem from '@/hooks/useUpdateShoppingListItem';
import useDeleteShoppingListItem from '@/hooks/useDeleteShoppingListItem';
import { Formik, FormikHelpers } from 'formik';
import TextField from '@/components/form/TextField';
import * as Yup from 'yup';
import { Navigation } from 'react-native-navigation';
import { ScreenProps, Screen } from '@/types/navigation';
import SubmitButton from '@/components/form/SubmitButton';
import SafeAreaView from 'react-native-safe-area-view';

export interface EditShoppingListItemProps {
    listId: number;
    item: ShoppingListItemType;
}

interface FormValues {
    name: string;
    quantity: number;
}

const EditShoppingListItem: Screen<EditShoppingListItemProps & ScreenProps> = (
    props,
) => {
    const [updateItem] = useUpdateShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const [deleteItem] = useDeleteShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const initialFormValues: FormValues = {
        name: props.item.item.name,
        quantity: props.item.quantity,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });

    const onSubmit = (values: FormValues, form: FormikHelpers<FormValues>) => {
        updateItem(values).then(() => {
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
                                flexDirection: 'row',
                                paddingTop: 20,
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setFieldValue(
                                        'quantity',
                                        --values.quantity,
                                    );
                                }}>
                                <BodyText>-</BodyText>
                            </TouchableOpacity>
                            <BodyText>{values.quantity}</BodyText>
                            <TouchableOpacity
                                onPress={() => {
                                    setFieldValue(
                                        'quantity',
                                        ++values.quantity,
                                    );
                                }}>
                                <BodyText>+</BodyText>
                            </TouchableOpacity>
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
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default EditShoppingListItem;
