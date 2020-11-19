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

interface Props extends ScreenProps {}

const Home: Screen<Props> = (props) => {
    const me = useMe();
    const lists = useShoppingLists();
    const items = useItems();

    return (
        <SafeAreaView>
            <BodyText>Hi, {me?.data?.name}</BodyText>
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
            <LogoutButton />
        </SafeAreaView>
    );
};

export default Home;
