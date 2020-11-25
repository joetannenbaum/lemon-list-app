import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import Loading from '@/components/Loading';
import api from '@/api';
import { AxiosResponse } from 'axios';
import { View, TouchableOpacity, ScrollView, Button } from 'react-native';
import { ApiResource } from '@/types/ApiResource';
import { ParsedUrl, ParsedItem } from '@/types/Parsed';
import Checkbox from '@/components/Checkbox';
import BodyText from '@/components/BodyText';
import useShoppingLists from '@/hooks/useShoppingLists';
import Select from '@/components/form/Select';
import { Formik } from 'formik';
import omit from 'lodash/omit';
import SubmitButton from '@/components/form/SubmitButton';
import { Navigation } from 'react-native-navigation';

export interface IncomingShareProps {
    text: string | null;
    url: string | null;
}

const IncomingShare: Screen<IncomingShareProps & ScreenProps> = (props) => {
    const [error, setError] = useState<string | null>(null);
    const [urlData, setUrlData] = useState<
        Omit<ParsedUrl, 'items'> | undefined
    >();
    const [items, setItems] = useState<ParsedItem[]>([]);

    const lists = useShoppingLists();

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
    }, [props.text, props.url]);

    const initialFormValues = {
        listId: lists.data?.length ? lists.data[0].id : null,
    };

    const onSubmit = (values) => {
        console.log({ values });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {items.length === 0 && <Loading />}
            {items.length !== 0 && (
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <Formik
                            onSubmit={onSubmit}
                            initialValues={initialFormValues}>
                            {() => (
                                <>
                                    <View style={{ padding: 20 }}>
                                        {urlData?.title ? (
                                            <>
                                                <BodyText align="center">
                                                    Importing Ingredients from
                                                </BodyText>
                                                <BodyText
                                                    align="center"
                                                    bold={true}>
                                                    {urlData.title}
                                                    {/* {urlData.url} */}
                                                </BodyText>
                                                <BodyText align="center">
                                                    into list:
                                                </BodyText>
                                            </>
                                        ) : (
                                            <BodyText align="center">
                                                Importing Ingredients into list:
                                            </BodyText>
                                        )}
                                        <Select
                                            name="listId"
                                            items={lists.data?.map((list) => ({
                                                label: list.name,
                                                value: list.id,
                                            }))}
                                        />
                                    </View>
                                    {items.map((item) => (
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
                                                    checked={true}
                                                    // onPress={toggleCheck}
                                                />
                                                <View style={{ flex: 1 }}>
                                                    <BodyText>
                                                        {item.name}
                                                    </BodyText>
                                                    <BodyText
                                                        style={{
                                                            color: '#999',
                                                        }}>
                                                        {item.original}
                                                    </BodyText>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}>
                                                    <TouchableOpacity
                                                        onPress={() => {}}>
                                                        <BodyText>-</BodyText>
                                                    </TouchableOpacity>
                                                    <BodyText>
                                                        {item.quantity}
                                                    </BodyText>
                                                    <TouchableOpacity
                                                        onPress={() => {}}>
                                                        <BodyText>+</BodyText>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </>
                            )}
                        </Formik>
                    </ScrollView>
                    <SubmitButton>Add Items</SubmitButton>
                    <Button
                        title="Cancel"
                        onPress={() => {
                            Navigation.dismissModal(props.componentId);
                        }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default IncomingShare;
