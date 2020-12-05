import React, { useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import LogoutButton from '@/components/LogoutButton';
import useMe from '@/hooks/useMe';
import useShoppingLists from '@/hooks/useShoppingLists';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CreateListForm from '@/components/CreateListForm';
import { Navigation } from 'react-native-navigation';
import {
    mainStackId,
    screenComponent,
    handleDynamicLink,
} from '@/util/navigation';
import useItems from '@/hooks/useItems';
import useStores from '@/hooks/useStores';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import useListenForDynamicLinks from '@/hooks/useListenForDynamicLinks';
import useListenForIncomingShare from '@/hooks/useListenForIncomingShare';
import Wrapper from '@/components/Wrapper';
import {
    flexCenter,
    bsl,
    sizeImage,
    black,
    centeredRow,
    getColorFromString,
    grey200,
} from '@/util/style';
import ListWrapper from '@/components/ListWrapper';
import BaseText from '@/components/BaseText';

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
        <Wrapper>
            {lists?.data?.length === 0 && (
                <View>
                    <BaseText>
                        You don't have any lists! Create one now.
                    </BaseText>
                </View>
            )}

            <View style={styles.wrapper}>
                <ListWrapper>
                    {lists?.data?.map((list) => {
                        return (
                            <TouchableOpacity
                                style={styles.listItem}
                                key={list.id.toString()}
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
                                <View
                                    style={[
                                        styles.colorIndicator,
                                        {
                                            backgroundColor: getColorFromString(
                                                list.name,
                                            ),
                                        },
                                    ]}
                                />
                                <View style={styles.listItemInner}>
                                    <View style={styles.listItemTextWrapper}>
                                        <BaseText size={40}>
                                            {list.name}
                                        </BaseText>
                                    </View>
                                    <Image
                                        style={styles.carat}
                                        source={require('@images/carat-right.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ListWrapper>

                {/* <CreateListForm /> */}
            </View>

            {/* <View style={{ marginTop: 100 }}>
                <LogoutButton />
            </View> */}
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        ...flexCenter,
        padding: bsl(20),
    },
    listItem: {
        ...centeredRow,
        borderBottomColor: grey200,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    listItemInner: {
        ...centeredRow,
        justifyContent: 'space-between',
        padding: bsl(24),
        flex: 1,
    },
    listItemTextWrapper: {
        paddingRight: bsl(10),
    },
    carat: {
        ...sizeImage(16, 24, { width: 16 }),
        tintColor: black,
    },
    colorIndicator: {
        width: bsl(20),
        alignSelf: 'stretch',
    },
});

export default Home;
