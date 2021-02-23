import React, { useState } from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import SafeAreaView from 'react-native-safe-area-view';
import { View, Button } from 'react-native';
import BaseText from '@/components/BaseText';
import useShoppingList from '@/hooks/useShoppingList';
import Config from 'react-native-config';
import asModal, { asModalExportedProps, asModalProps } from './asModal';
import SubmitButton from './form/SubmitButton';
import { bsl } from '@/util/style';
import CancelButton from './form/CancelButton';

export interface ShareShoppingListProps {
    id: number;
}

const ShareShoppingList: React.FC<
    ShareShoppingListProps & asModalExportedProps & asModalProps
> = (props) => {
    const list = useShoppingList(props.id);

    const [processing, setProcessing] = useState(false);

    const onSharePress = async () => {
        setProcessing(true);

        const link = await dynamicLinks().buildShortLink({
            link: `${Config.API_URL}/list/${list.data?.uuid}`,
            domainUriPrefix: 'https://grocerylistlocal.page.link',
        });

        Share.open({
            title: `Share ${list.data?.name}`,
            message: `Join my list on the Grocery List app: ${link}`,
            url: link,
        })
            .then((res) => {
                props.dismiss();
            })
            .catch((err) => {
                props.dismiss();
                err && console.log(err);
            });
    };

    return (
        <View style={{ padding: 20 }}>
            <BaseText align="center">
                Sharing a list means that anyone with the link to the list can
                contribute or check off items in a list.
            </BaseText>

            <View style={{ paddingTop: bsl(60) }}>
                <SubmitButton processing={processing} onPress={onSharePress}>
                    Share List
                </SubmitButton>
                <CancelButton onPress={props.dismiss} />
            </View>
        </View>
    );
};

export default asModal(ShareShoppingList);
