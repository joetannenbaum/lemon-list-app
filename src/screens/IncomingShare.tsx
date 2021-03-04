import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import Loading from '@/components/Loading';
import api from '@/api';
import { AxiosResponse } from 'axios';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ApiResource } from '@/types/ApiResource';
import { ParsedUrl, ParsedItem } from '@/types/Parsed';
import Checkbox from '@/components/Checkbox';
import useShoppingLists from '@/hooks/useShoppingLists';
import { Formik, FormikHelpers } from 'formik';
import omit from 'lodash/omit';
import SubmitButton from '@/components/form/SubmitButton';
import { Navigation } from 'react-native-navigation';
import QuantityControlField from '@/components/QuantityControlField';
import TextField from '@/components/form/TextField';
import AutoGrowTextField from '@/components/form/AutoGrowTextField';
import useAddShoppingList from '@/hooks/useAddShoppingList';
import Header from '@/components/Header';
import { getColorFromString, yellow100, bsl } from '@/util/style';
import Wrapper from '@/components/Wrapper';
import Footer from '@/components/Footer';
import CancelButton from '@/components/form/CancelButton';
import FooterForm from '@/components/FooterForm';
import { showPopup, screenComponent } from '@/util/navigation';
import IncomingShareListSelection from '@/components/IncomingShareListSelection';
import ListItem from '@/components/ListItem';

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

    const { mutateAsync: addShoppingList } = useAddShoppingList();

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

    const title = urlData?.title ? urlData.title : 'Importing Ingredients';

    const color = getColorFromString(title);

    if (items.length === 0) {
        return <Loading />;
    }

    return (
        <Wrapper forceInset={{ top: 'never', bottom: 'never' }}>
            <View style={{ flex: 1 }}>
                <Formik onSubmit={onSubmit} initialValues={initialFormValues}>
                    {({
                        values,
                        setFieldValue,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <>
                            <Header color={color} hideMenu={true}>
                                {title}
                            </Header>
                            <TouchableOpacity
                                style={styles.selectListButton}
                                onPress={() =>
                                    showPopup('IncomingShareImportList', {
                                        onSelect: (listId: number) => {
                                            setFieldValue('listId', listId);
                                            setFieldValue('newListName', '');
                                        },
                                        onNewName: (name: string) => {
                                            setFieldValue('listId', null);
                                            setFieldValue('newListName', name);
                                        },
                                    })
                                }>
                                <IncomingShareListSelection />
                            </TouchableOpacity>
                            <ScrollView style={styles.scrollView}>
                                {values.items.map((item, index) => (
                                    <ListItem
                                        key={item.id.toString()}
                                        name={values.items[index].name}
                                        note={values.items[index].note}
                                        quantity={values.items[index].quantity}
                                        onPress={() => {
                                            showPopup('EditIncomingShareItem', {
                                                name: values.items[index].name,
                                                note: values.items[index].note,
                                                onUpdate({ name, note }) {
                                                    setFieldValue(
                                                        `items.${index}.name`,
                                                        name,
                                                    );
                                                    setFieldValue(
                                                        `items.${index}.note`,
                                                        note,
                                                    );
                                                },
                                            });
                                        }}
                                        onQuantityChange={(newQuantity) => {
                                            setFieldValue(
                                                `items.${index}.quantity`,
                                                newQuantity,
                                            );
                                        }}
                                        checkedOff={
                                            values.items[index].selected
                                        }
                                        toggleCheck={() => {
                                            setFieldValue(
                                                `items.${index}.selected`,
                                                !values.items[index].selected,
                                            );
                                        }}
                                    />
                                ))}
                            </ScrollView>
                            <Footer color={color}>
                                <FooterForm>
                                    <SubmitButton
                                        onPress={handleSubmit}
                                        processing={isSubmitting}>
                                        Add Items
                                    </SubmitButton>
                                </FooterForm>
                                <CancelButton
                                    onPress={() => {
                                        Navigation.dismissModal(
                                            props.componentId,
                                        );
                                    }}
                                />
                            </Footer>
                        </>
                    )}
                </Formik>
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    selectListButton: {
        backgroundColor: yellow100,
        paddingHorizontal: bsl(20),
        paddingVertical: bsl(20),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
});

export default IncomingShare;
