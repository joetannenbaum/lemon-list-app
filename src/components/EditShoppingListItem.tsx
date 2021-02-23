import React from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BaseText from '@/components/BaseText';
import { View, Alert } from 'react-native';
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
import { bsl, grey300 } from '@/util/style';
import CancelButton from './form/CancelButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import asModal, { asModalExportedProps, asModalProps } from './asModal';

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

const EditShoppingListItem: React.FC<
    EditShoppingListItemProps & asModalProps & asModalExportedProps
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
                    <View style={{ paddingBottom: bsl(20) }}>
                        <TouchableOpacity onPress={onDeletePress}>
                            <BaseText align="right" color="red">
                                Delete
                            </BaseText>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <View style={{ flex: 1 }}>
                            <AutoGrowTextField
                                required={true}
                                name="name"
                                placeholder="Item"
                                onSubmitEditing={handleSubmit}
                            />
                        </View>

                        <View
                            style={{
                                paddingLeft: bsl(20),
                            }}>
                            <QuantityControlField name="quantity" />
                        </View>
                    </View>
                    <View style={{ paddingVertical: bsl(20) }}>
                        <AutoGrowTextField
                            name="note"
                            maxLength={100}
                            placeholder="Add a note"
                        />
                    </View>
                    <View style={{ paddingBottom: bsl(20) }}>
                        {storesWithTags.map((store, i) => (
                            <View
                                style={[
                                    {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingVertical: bsl(20),
                                    },
                                    i + 1 < storesWithTags.length && {
                                        borderBottomWidth: bsl(3),
                                        borderBottomColor: grey300,
                                    },
                                ]}
                                key={store.id.toString()}>
                                <BaseText bold={true}>{store.name}</BaseText>
                                <Select
                                    name={`store_tags.${store.id}`}
                                    items={sortBy(store.tags, 'name').map(
                                        (tag) => ({
                                            label: tag.name,
                                            value: tag.id,
                                        }),
                                    )}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={{ paddingTop: bsl(20) }}>
                        <SubmitButton
                            disabled={values.name === ''}
                            onPress={handleSubmit}
                            processing={isSubmitting}>
                            Update
                        </SubmitButton>
                        <CancelButton onPress={props.dismiss} />
                    </View>
                </View>
            )}
        </Formik>
    );
};

export default asModal(EditShoppingListItem);
