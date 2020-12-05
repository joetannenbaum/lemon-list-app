import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import Loading from '@/components/Loading';
import api from '@/api';
import { AxiosResponse } from 'axios';
import { View, ScrollView, Button } from 'react-native';
import { ApiResource } from '@/types/ApiResource';
import { ParsedUrl, ParsedItem } from '@/types/Parsed';
import Checkbox from '@/components/Checkbox';
import BaseText from '@/components/BaseText';
import useShoppingLists from '@/hooks/useShoppingLists';
import Select from '@/components/form/Select';
import { Formik, FieldArray, FormikHelpers } from 'formik';
import omit from 'lodash/omit';
import SubmitButton from '@/components/form/SubmitButton';
import { Navigation } from 'react-native-navigation';
import QuantityControlField from '@/components/QuantityControlField';
import TextField from '@/components/form/TextField';
import AutoGrowTextField from '@/components/form/AutoGrowTextField';
import useAddShoppingList from '@/hooks/useAddShoppingList';

export interface IncomingShareProps {
    text: string | null;
    url: string | null;
}

interface PossibleItem {
    id: number;
    note: string;
    name: string;
    default_tag: string;
    quantity: number;
    selected: boolean;
}

interface FormValues {
    newListName: string;
    listId: number | null;
    items: PossibleItem[];
}

const IncomingShare: Screen<IncomingShareProps & ScreenProps> = (props) => {
    const [error, setError] = useState<string | null>(null);
    const [urlData, setUrlData] = useState<
        Omit<ParsedUrl, 'items'> | undefined
    >();
    const [items, setItems] = useState<ParsedItem[]>([]);

    const lists = useShoppingLists();

    const [addShoppingList] = useAddShoppingList();

    const handleUrlResponse = (
        result: AxiosResponse<ApiResource<ParsedUrl>>,
    ) => {
        setUrlData(omit(result.data.data, 'items'));
        setItems(result.data.data.items);
    };

    const handleTextResponse = (
        result: AxiosResponse<ApiResource<ParsedItem[]>>,
    ) => {
        setItems(result.data.data);
    };

    useEffect(() => {
        if (props.url !== null) {
            api.post('parse/url', {
                url: props.url,
            }).then(handleUrlResponse);
        }

        if (props.text !== null) {
            api.post('parse/text', {
                text: props.text,
            }).then(handleTextResponse);
        }

        if (props.url === null && props.text === null) {
            setError(
                'There was a problem importing your items, please try again.',
            );
        }
    }, []);

    const initialFormValues: FormValues = {
        newListName: '',
        listId: null,
        items: items.map((item) => ({
            id: item.id,
            note: item.original,
            name: item.name,
            default_tag: item.aisle,
            quantity: item.quantity,
            selected: true,
        })),
    };

    const onSubmit = async (
        values: FormValues,
        form: FormikHelpers<FormValues>,
    ) => {
        const selectedItems = values.items.filter((item) => item.selected);

        if (selectedItems.length === 0) {
            // TODO: Make this more official (disable button)
            form.setFieldError('items', 'You must select at least one item');
            return;
        }

        const getListVersionId = async () => {
            if (!values.newListName) {
                return lists.data?.find((list) => list.id === values.listId)
                    ?.active_version?.id;
            }

            const newList = await addShoppingList({
                name: values.newListName,
            });

            return newList?.data.data.active_version.id;
        };

        const listVersionId = await getListVersionId();

        api.post(`shopping-list-versions/${listVersionId}/batch-items`, {
            items: selectedItems,
        })
            .then((res) => {
                form.setSubmitting(false);
                form.resetForm();
            })
            .catch((error) => {
                // form.setSubmitting(false);
                // logger.red(error);
            });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {items.length === 0 && <Loading />}
            {items.length !== 0 && (
                <View style={{ flex: 1 }}>
                    <Formik
                        onSubmit={onSubmit}
                        initialValues={initialFormValues}>
                        {({
                            values,
                            setFieldValue,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <>
                                <ScrollView style={{ flex: 1 }}>
                                    <View style={{ padding: 20 }}>
                                        {urlData?.title ? (
                                            <>
                                                <BaseText align="center">
                                                    Importing Ingredients from
                                                </BaseText>
                                                <BaseText
                                                    align="center"
                                                    bold={true}>
                                                    {urlData.title}
                                                    {/* {urlData.url} */}
                                                </BaseText>
                                                <BaseText
                                                    numberOfLines={1}
                                                    align="center">
                                                    {urlData.url}
                                                </BaseText>
                                                <BaseText align="center">
                                                    into list:
                                                </BaseText>
                                            </>
                                        ) : (
                                            <BaseText align="center">
                                                Importing Ingredients into list:
                                            </BaseText>
                                        )}
                                        <Select
                                            name="listId"
                                            items={lists.data?.map((list) => ({
                                                label: list.name,
                                                value: list.id,
                                            }))}
                                        />
                                        <BaseText align="center">or</BaseText>
                                        <TextField
                                            name="newListName"
                                            placeholder="New List"
                                        />
                                    </View>
                                    {values.items.map((item, index) => (
                                        <View key={item.id.toString()}>
                                            <View
                                                style={[
                                                    {
                                                        padding: 10,
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'space-between',
                                                        backgroundColor: '#fff',
                                                    },
                                                ]}>
                                                <Checkbox
                                                    checked={item.selected}
                                                    onPress={() => {
                                                        setFieldValue(
                                                            `items.${index}.selected`,
                                                            !item.selected,
                                                        );
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        opacity: item.selected
                                                            ? 1
                                                            : 0.25,
                                                    }}>
                                                    <TextField
                                                        name={`items.${index}.name`}
                                                        placeholder="Name"
                                                        editable={item.selected}
                                                    />
                                                    <AutoGrowTextField
                                                        name={`items.${index}.note`}
                                                        placeholder="Note"
                                                        editable={item.selected}
                                                    />
                                                </View>
                                                <QuantityControlField
                                                    name={`items.${index}.quantity`}
                                                />
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                                <SubmitButton
                                    onPress={handleSubmit}
                                    processing={isSubmitting}>
                                    Add Items
                                </SubmitButton>
                                <Button
                                    title="Cancel"
                                    onPress={() => {
                                        Navigation.dismissModal(
                                            props.componentId,
                                        );
                                    }}
                                />
                            </>
                        )}
                    </Formik>
                </View>
            )}
        </SafeAreaView>
    );
};

export default IncomingShare;
