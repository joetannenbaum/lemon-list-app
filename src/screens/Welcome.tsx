import React, { useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import Wrapper from '@/components/Wrapper';
import LemonSliceText from '@/components/LemonSliceText';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import BaseText from '@/components/BaseText';
import { bsl } from '@/util/style';
import CreateListForm from '@/components/CreateListForm';
import useShoppingLists from '@/hooks/useShoppingLists';
import { setStackRootWithoutAnimating } from '@/util/navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export interface WelcomeProps {}

const Welcome: Screen<WelcomeProps & ScreenProps> = (props) => {
    const lists = useShoppingLists();

    useEffect(() => {
        if (lists.data.length > 0) {
            setStackRootWithoutAnimating('App');
        }
    }, [lists.data]);

    return (
        <Wrapper>
            <KeyboardAwareScrollView contentContainerStyle={styles.wrapper}>
                <LemonSliceText text="Welc<slice>me!" />
                <BaseText align="center">
                    We're happy to have you. Let's get started by adding your
                    first list:
                </BaseText>
                <View style={styles.formWrapper}>
                    <CreateListForm />
                </View>
            </KeyboardAwareScrollView>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: bsl(60),
    },
    formWrapper: {
        marginTop: bsl(60),
        width: '100%',
    },
});

export default Welcome;
