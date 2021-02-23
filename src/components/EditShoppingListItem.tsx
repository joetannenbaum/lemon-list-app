import React, { useRef, useEffect } from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BaseText from '@/components/BaseText';
import { View, Button, Alert, Modal, StyleSheet, Animated } from 'react-native';
import useUpdateShoppingListItem from '@/hooks/useUpdateShoppingListItem';
import useDeleteShoppingListItem from '@/hooks/useDeleteShoppingListItem';
import { Formik, FormikHelpers } from 'formik';
import TextField from '@/components/form/TextField';
import * as Yup from 'yup';
import SubmitButton from '@/components/form/SubmitButton';
import Select from '@/components/form/Select';
import useStores from '@/hooks/useStores';
import sortBy from 'lodash/sortBy';
import useUpdateItem from '@/hooks/useUpdateItem';
import omit from 'lodash/omit';
import AutoGrowTextField from '@/components/form/AutoGrowTextField';
import QuantityControlField from '@/components/QuantityControlField';
import { bsl, paddingX, marginX, paddingY } from '@/util/style';
import CancelButton from './form/CancelButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface EditShoppingListItemProps {
    listId: number;
    item: ShoppingListItemType;
    onDismiss: () => void;
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

const EditShoppingListItem: React.FC<EditShoppingListItemProps> = (props) => {
    const stores = useStores();

    const animatedValue = useRef(new Animated.Value(0));

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
            dismiss();
        });
    };

    useEffect(() => {
        Animated.spring(animatedValue.current, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }, []);

    const dismiss = () => {
        Animated.spring(animatedValue.current, {
            toValue: 0,
            useNativeDriver: true,
        }).start(props.onDismiss);
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
                        deleteItem().then(dismiss);
                    },
                },
            ],
        );
    };

    return (
        <Modal presentationStyle="overFullScreen" transparent={true}>
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        opacity: animatedValue.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            />
            <View style={{ flex: 1 }} />
            <Animated.View
                style={[
                    styles.wrapper,
                    {
                        transform: [
                            {
                                translateY: animatedValue.current.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [bsl(1000), bsl(40)],
                                }),
                            },
                        ],
                    },
                ]}>
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
                                    <TextField
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
                            <View style={{ ...paddingY(20) }}>
                                <AutoGrowTextField
                                    name="note"
                                    maxLength={100}
                                    placeholder="Add a note"
                                />
                            </View>
                            <View style={{ paddingBottom: bsl(20) }}>
                                {stores.data
                                    ?.filter((store) => store.tags.length > 0)
                                    .map((store) => (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}
                                            key={store.id.toString()}>
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
                            <SubmitButton
                                disabled={values.name === ''}
                                onPress={handleSubmit}
                                processing={isSubmitting}>
                                Update
                            </SubmitButton>
                            <CancelButton onPress={dismiss} />
                        </View>
                    )}
                </Formik>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        justifyContent: 'flex-end',
    },
    wrapper: {
        backgroundColor: '#fff',
        padding: bsl(40),
        borderRadius: bsl(20),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: bsl(1),
        },
        shadowRadius: bsl(3),
        shadowOpacity: 0.1,
        elevation: 3,
        paddingBottom: bsl(120),
        ...marginX(20),
    },
});

export default EditShoppingListItem;
