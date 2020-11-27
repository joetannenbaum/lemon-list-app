import React, { useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import LogoutButton from '@/components/LogoutButton';
import useMe from '@/hooks/useMe';
import SafeAreaView from 'react-native-safe-area-view';
import BodyText from '@/components/BodyText';
import useShoppingLists from '@/hooks/useShoppingLists';
import { View, TouchableOpacity } from 'react-native';
import CreateListForm from '@/components/CreateListForm';
import { Navigation } from 'react-native-navigation';
import {
    mainStackId,
    screenComponent,
    handleDynamicLink,
} from '@/util/navigation';
import useItems from '@/hooks/useItems';
import useStores from '@/hooks/useStores';
import CreateStoreForm from '@/components/CreateStoreForm';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import useListenForDynamicLinks from '@/hooks/useListenForDynamicLinks';
import useListenForIncomingShare from '@/hooks/useListenForIncomingShare';

interface Props extends ScreenProps {}

const Home: Screen<Props> = (props) => {
    const me = useMe();
    const lists = useShoppingLists();
    const stores = useStores();
    // TODO: Is there a pre-warm cache option instead of storing this in a variable?
    const items = useItems();

    useEffect(() => {
        dynamicLinks().getInitialLink().then(handleDynamicLink);
    }, []);

    useListenForDynamicLinks();
    useListenForIncomingShare();

    return (
        <SafeAreaView>
            <BodyText>Hi, {me?.data?.name}</BodyText>

            <View
                style={{
                    paddingTop: 50,
                    paddingBottom: 50,
                    paddingLeft: 25,
                    paddingRight: 25,
                }}>
                <BodyText size={30} bold={true}>
                    Lists
                </BodyText>

                {lists?.data?.length === 0 && (
                    <View>
                        <BodyText>
                            You don't have any lists! Create one now.
                        </BodyText>
                    </View>
                )}

                <CreateListForm />

                {lists?.data?.map((list) => {
                    return (
                        <TouchableOpacity
                            key={`${list.id}`}
                            onPress={() => {
                                Navigation.push(
                                    mainStackId,
                                    screenComponent('ShoppingList', {
                                        passProps: {
                                            id: list.id,
                                        },
                                        options: {
                                            topBar: {
                                                title: {
                                                    text: list.name,
                                                },
                                            },
                                        },
                                    }),
                                );
                            }}>
                            <BodyText bold={true}>{list.name}</BodyText>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View
                style={{
                    paddingTop: 50,
                    paddingBottom: 50,
                    paddingLeft: 25,
                    paddingRight: 25,
                }}>
                <BodyText size={30} bold={true}>
                    Stores
                </BodyText>

                {stores?.data?.length === 0 && (
                    <View>
                        <BodyText>
                            You don't have any stores! Create one now.
                        </BodyText>
                    </View>
                )}

                <CreateStoreForm />

                {stores?.data?.map((store) => {
                    return (
                        <TouchableOpacity
                            key={`${store.id}`}
                            onPress={() => {
                                Navigation.push(
                                    mainStackId,
                                    screenComponent('Store', {
                                        passProps: {
                                            id: store.id,
                                        },
                                    }),
                                );
                            }}>
                            <BodyText bold={true}>{store.name}</BodyText>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={{ marginTop: 100 }}>
                <LogoutButton />
            </View>
        </SafeAreaView>
    );
};

export default Home;
