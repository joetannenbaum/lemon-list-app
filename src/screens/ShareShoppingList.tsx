import React, { useState } from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import { View } from 'react-native';
import BaseText from '@/components/BaseText';
import useShoppingList from '@/hooks/useShoppingList';
import Config from 'react-native-config';
import asModal from '@/components/asModal';
import SubmitButton from '@/components/form/SubmitButton';
import { bsl } from '@/util/style';
import { Screen, ModalScreenProps } from '@/types/navigation';
import { getBundleId } from 'react-native-device-info';

export interface ShareShoppingListProps {
    id: number;
}

const ShareShoppingList: Screen<ShareShoppingListProps & ModalScreenProps> = (
    props,
) => {
    const list = useShoppingList(props.id);

    const [processing, setProcessing] = useState(false);

    const onSharePress = async () => {
        setProcessing(true);

        const link = await dynamicLinks().buildShortLink({
            link: `${Config.API_URL}/list/${list.data?.uuid}`,
            domainUriPrefix: `https://${Config.DYNAMIC_LINK_URL}`,
            android: {
                packageName: getBundleId(),
            },
        });

        Share.open({
            title: `Share ${list.data?.name}`,
            message: `I want to share my list with you on Lemon List: ${link}`,
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
        <View>
            <BaseText align="center">
                Sharing a list means that anyone with the link to the list can
                contribute or check off items in a list.
            </BaseText>

            <View style={{ paddingTop: bsl(60) }}>
                <SubmitButton processing={processing} onPress={onSharePress}>
                    Share List
                </SubmitButton>
            </View>
        </View>
    );
};

export default asModal(ShareShoppingList);
