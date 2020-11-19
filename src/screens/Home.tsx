import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import LogoutButton from '@/components/LogoutButton';
import useMe from '@/hooks/useMe';
import SafeAreaView from 'react-native-safe-area-view';
import BodyText from '@/components/BodyText';
import useShoppingLists from '@/hooks/useShoppingLists';
import { View, TouchableOpacity } from 'react-native';
import CreateListForm from '@/components/CreateListForm';
import { Navigation } from 'react-native-navigation';
import { mainStackId, screenComponent } from '@/util/navigation';
import useItems from '@/hooks/useItems';
import useStores from '@/hooks/useStores';
import CreateStoreForm from '@/components/CreateStoreForm';

interface Props extends ScreenProps {}

const Home: Screen<Props> = (props) => {
    const me = useMe();
    const lists = useShoppingLists();
    const stores = useStores();
    const items = useItems();

    return (
        <SafeAreaView>
            <BodyText>Hi, {me?.data?.name}</BodyText>

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
                                }),
                            );
                        }}>
                        <BodyText>{list.name}</BodyText>
                    </TouchableOpacity>
                );
            })}

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
                        <BodyText>{store.name}</BodyText>
                    </TouchableOpacity>
                );
            })}

            <View style={{ marginTop: 200 }}>
                <LogoutButton />
            </View>
        </SafeAreaView>
    );
};

export default Home;
