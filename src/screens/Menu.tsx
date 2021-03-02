import React, { useRef, useEffect, useCallback } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import {
    View,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import useMe from '@/hooks/useMe';
import useShoppingLists from '@/hooks/useShoppingLists';
import useStores from '@/hooks/useStores';
import { setStackRootWithoutAnimating, hideMenu } from '@/util/navigation';
import { bsl, yellow100 } from '@/util/style';
import ArrowButton from '@/components/ArrowButton';
import LogoutButton from '@/components/LogoutButton';
import BaseText from '@/components/BaseText';
import Divider from '@/components/Divider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from 'react-native-navigation';
import CreateStoreForm from '@/components/CreateStoreForm';
import CreateListForm from '@/components/CreateListForm';

export interface MenuProps {}

const Menu: Screen<MenuProps & ScreenProps> = (props) => {
    const me = useMe();
    const lists = useShoppingLists();
    const stores = useStores();

    const { top } = useSafeAreaInsets();

    const animatedValue = useRef(new Animated.Value(0));

    useEffect(() => {
        Animated.spring(animatedValue.current, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }, []);

    const closeMenu = useCallback(() => {
        Animated.timing(animatedValue.current, {
            toValue: 0,
            useNativeDriver: true,
            duration: 250,
        }).start(() => {
            Navigation.dismissOverlay(props.componentId);
        });
    }, []);

    return (
        <>
            <TouchableWithoutFeedback onPress={closeMenu}>
                <Animated.View
                    style={[
                        styles.overlay,
                        {
                            opacity: animatedValue.current,
                        },
                    ]}
                />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    styles.wrapper,
                    {
                        transform: [
                            {
                                translateX: animatedValue.current.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [bsl(-700), 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                ]}>
                <View style={[styles.headerWrapper, { paddingTop: top }]}>
                    <View style={styles.header}>
                        <BaseText>
                            Hi, {me.data?.name.split(' ').shift()}
                        </BaseText>
                        <LogoutButton />
                    </View>
                </View>
                <View style={styles.section}>
                    <BaseText bold={true}>My Lists</BaseText>
                    <Divider marginTop={20} />
                    {lists?.data?.map((list) => {
                        return (
                            <ArrowButton
                                key={list.id.toString()}
                                onPress={() => {
                                    setStackRootWithoutAnimating(
                                        'ShoppingList',
                                        {
                                            id: list.id,
                                        },
                                    );

                                    closeMenu();
                                }}>
                                {list.name}
                            </ArrowButton>
                        );
                    })}
                    <View style={styles.formWrapper}>
                        <CreateListForm />
                    </View>
                </View>
                <View style={styles.section}>
                    <BaseText bold={true}>My Stores</BaseText>
                    <Divider marginTop={20} />
                    {stores?.data?.map((store) => {
                        return (
                            <ArrowButton
                                key={store.id.toString()}
                                onPress={() => {
                                    setStackRootWithoutAnimating('Store', {
                                        id: store.id,
                                    });

                                    closeMenu();
                                }}>
                                {store.name}
                            </ArrowButton>
                        );
                    })}
                    <View style={styles.formWrapper}>
                        <CreateStoreForm />
                    </View>
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: bsl(20),
        width: '75%',
        backgroundColor: '#fff',
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    headerWrapper: {
        backgroundColor: yellow100,
        marginHorizontal: bsl(-20),
        marginBottom: bsl(20),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: bsl(20),
        paddingTop: bsl(20),
        paddingBottom: bsl(20),
    },
    section: {
        paddingTop: bsl(20),
        paddingBottom: bsl(40),
    },
    formWrapper: {
        marginTop: bsl(20),
    },
});

Menu.options = {
    layout: {
        componentBackgroundColor: 'transparent',
    },
    overlay: {
        interceptTouchOutside: true,
        handleKeyboardEvents: true,
    },
};

export default Menu;
