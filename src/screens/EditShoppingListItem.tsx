import React from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BaseText from '@/components/BaseText';
import { View, Alert, ScrollView, StyleSheet } from 'react-native';
import useUpdateShoppingListItem from '@/hooks/useUpdateShoppingListItem';
import useDeleteShoppingListItem from '@/hooks/useDeleteShoppingListItem';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SubmitButton from '@/components/form/SubmitButton';
import Select from '@/components/form/Select';
import useStores from '@/hooks/useStores';
import sortBy from 'lodash/sortBy';
import useUpdateItem from '@/hooks/useUpdateItem';
import omit from 'lodash/omit';
import AutoGrowTextField from '@/components/form/AutoGrowTextField';
import QuantityControlField from '@/components/QuantityControlField';
import { bsl } from '@/util/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import asModal from '@/components/asModal';
import { Screen, ModalScreenProps } from '@/types/navigation';
import Divider from '@/components/Divider';

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

const EditShoppingListItem: Screen<
    EditShoppingListItemProps & ModalScreenProps
> = (props) => {
    const stores = useStores();

    const storesWithTags =
        stores.data?.filter((store) => store.tags.length > 0) || [];

    const { mutateAsync: updateShoppingListItem } = useUpdateShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const { mutateAsync: updateItem } = useUpdateItem(props.item.item.id);

    const { mutateAsync: deleteItem } = useDeleteShoppingListItem(
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
            props.dismiss();
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
                        deleteItem().then(props.dismiss);
                    },
                },
            ],
        );
    };

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({ handleSubmit, isSubmitting, values }) => (
                <View>
                    <View style={styles.deleteWrapper}>
                        <TouchableOpacity onPress={onDeletePress}>
                            <BaseText align="right" color="red">
                                Delete
                            </BaseText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.topFormRow}>
                        <View style={styles.nameWrapper}>
                            <AutoGrowTextField
                                required={true}
                                name="name"
                                placeholder="Item"
                                onSubmitEditing={handleSubmit}
                            />
                        </View>

                        <View style={styles.quantityWrapper}>
                            <QuantityControlField name="quantity" />
                        </View>
                    </View>
                    <View style={styles.notesWrapper}>
                        <AutoGrowTextField
                            name="note"
                            maxLength={100}
                            placeholder="Add a note"
                        />
                    </View>
                    {storesWithTags.length > 0 && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={styles.storesWrapper}>
                            {storesWithTags.map((store, i) => (
                                <React.Fragment key={store.id.toString()}>
                                    {i !== 0 && <Divider />}
                                    <View style={styles.storeRow}>
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
                                </React.Fragment>
                            ))}
                        </ScrollView>
                    )}
                    <View style={styles.footer}>
                        <SubmitButton
                            disabled={values.name === ''}
                            onPress={handleSubmit}
                            processing={isSubmitting}>
                            Update
                        </SubmitButton>
                    </View>
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    storeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: bsl(20),
    },
    footer: { paddingTop: bsl(20) },
    quantityWrapper: {
        paddingLeft: bsl(20),
    },
    topFormRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: bsl(20),
    },
    nameWrapper: { flex: 1 },
    deleteWrapper: { paddingBottom: bsl(20) },
    notesWrapper: { paddingBottom: bsl(20) },
    storesWrapper: { marginBottom: bsl(20), maxHeight: bsl(300) },
});

export default asModal(EditShoppingListItem);
