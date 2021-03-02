import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import { View, StyleSheet } from 'react-native';
import useMe from '@/hooks/useMe';
import useShoppingLists from '@/hooks/useShoppingLists';
import useStores from '@/hooks/useStores';
import { setStackRootWithoutAnimating, hideMenu } from '@/util/navigation';
import { bsl } from '@/util/style';
import Wrapper from '@/components/Wrapper';
import ArrowButton from '@/components/ArrowButton';
import LogoutButton from '@/components/LogoutButton';

export interface MenuProps {}

const Menu: Screen<MenuProps & ScreenProps> = (props) => {
    const me = useMe();
    const lists = useShoppingLists();
    const stores = useStores();

    return (
        <Wrapper>
            <View style={styles.wrapper}>
                {lists?.data?.map((list) => {
                    return (
                        <ArrowButton
                            key={list.id.toString()}
                            onPress={() => {
                                setStackRootWithoutAnimating('ShoppingList', {
                                    id: list.id,
                                });

                                hideMenu();
                            }}>
                            {list.name}
                        </ArrowButton>
                    );
                })}
            </View>
            <LogoutButton />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: bsl(20),
    },
});

export default Menu;
