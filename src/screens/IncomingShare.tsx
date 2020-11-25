import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import Loading from '@/components/Loading';
import api from '@/api';
import { AxiosResponse } from 'axios';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ApiResource } from '@/types/ApiResource';
import { ParsedUrl } from '@/types/ParsedUrl';
import Checkbox from '@/components/Checkbox';
import BodyText from '@/components/BodyText';
import useShoppingLists from '@/hooks/useShoppingLists';
import Select from '@/components/form/Select';
import { Formik } from 'formik';

export interface IncomingShareProps {
    text: string | null;
    url: string | null;
}

const IncomingShare: Screen<IncomingShareProps & ScreenProps> = (props) => {
    const [error, setError] = useState<string | null>(null);
    const [urlData, setUrlData] = useState<ParsedUrl | undefined>();

    const lists = useShoppingLists();

    const handleUrlResponse = (
        result: AxiosResponse<ApiResource<ParsedUrl>>,
    ) => {
        setUrlData(result.data.data);
    };

    const handleTextResponse = (
        result: AxiosResponse<ApiResource<ParsedUrl>>,
    ) => {
        // setUrlData(result.data.data);
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
        listId: lists.data[0].id,
    };

    const onSubmit = (values) => {
        console.log({ values });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {typeof urlData === 'undefined' && <Loading />}
            {typeof urlData !== 'undefined' && (
                <ScrollView style={{ flex: 1 }}>
                    <Formik
                        onSubmit={onSubmit}
                        initialValues={initialFormValues}>
                        {() => (
                            <>
                                <View style={{ padding: 20 }}>
                                    <BodyText align="center">
                                        Importing Ingredients from
                                    </BodyText>
                                    <BodyText align="center" bold={true}>
                                        {urlData.title}
                                    </BodyText>
                                    <BodyText align="center">
                                        into list:
                                    </BodyText>
                                    <Select
                                        name="listId"
                                        items={lists.data?.map((list) => ({
                                            label: list.name,
                                            value: list.id,
                                        }))}
                                    />
                                </View>
                                {urlData.items.map((item) => (
                                    <View>
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
                                                <BodyText>{item.name}</BodyText>
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
            )}
        </SafeAreaView>
    );
};

export default IncomingShare;
