import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import SafeAreaView from 'react-native-safe-area-view';
import { View, Button } from 'react-native';
import BodyText from '@/components/BodyText';
import useShoppingList from '@/hooks/useShoppingList';
import Config from 'react-native-config';
import { Navigation } from 'react-native-navigation';

export interface ShareShoppingListProps {
    id: number;
}

const ShareShoppingList: Screen<ShareShoppingListProps & ScreenProps> = (
    props,
) => {
    const list = useShoppingList(props.id);

    const onSharePress = async () => {
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
                Navigation.dismissModal(props.componentId);
            })
            .catch((err) => {
                err && console.log(err);
            });
    };

    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <BodyText>
                    Sharing a list means that anyone with the link to the list
                    can contribute or check off items in a list.
                </BodyText>

                <Button title="Share List" onPress={onSharePress} />
            </View>
        </SafeAreaView>
    );
};

export default ShareShoppingList;
