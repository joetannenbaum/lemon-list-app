import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import { View, StyleSheet } from 'react-native';
import Loading from '@/components/Loading';
import api from '@/api';
import BaseText from '@/components/BaseText';
import { ShoppingList } from '@/types/ShoppingList';
import { useQueryClient, useMutation } from 'react-query';
import { Navigation } from 'react-native-navigation';
import Header from '@/components/Header';
import Wrapper from '@/components/Wrapper';
import { bsl } from '@/util/style';
import SubmitButton from '@/components/form/SubmitButton';
import CancelButton from '@/components/form/CancelButton';
import { setStackRootWithoutAnimating } from '@/util/navigation';

export interface AcceptShareProps {
    listUuid: string;
}

const AcceptShare: Screen<AcceptShareProps & ScreenProps> = (props) => {
    const [list, setList] = useState<ShoppingList | null>(null);
    const [processing, setProcessing] = useState(false);

    const queryClient = useQueryClient();

    const { mutateAsync: joinList } = useMutation(
        () => {
            return api.post(`shopping-lists/join/${props.listUuid}`);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries('shopping-lists');
            },
        },
    );

    useEffect(() => {
        api.get(`shopping-lists/uuid/${props.listUuid}`).then((res) => {
            setList(res.data.data);
        });
    }, []);

    const onAcceptPress = () => {
        setProcessing(true);
        joinList().then(() => {
            setStackRootWithoutAnimating('ShoppingList', {
                id: list.id,
            });
            Navigation.dismissModal(props.componentId);
        });
    };

    const onCancelPress = () => Navigation.dismissModal(props.componentId);

    if (list === null) {
        return <Loading />;
    }

    return (
        <Wrapper>
            <Header hideMenu={true}>Join List</Header>
            <View style={styles.wrapper}>
                <View style={styles.paragraphWrapper}>
                    <BaseText align="center">
                        Do you want to join{' '}
                        <BaseText bold={true}>{list.name}</BaseText>?
                    </BaseText>
                </View>

                <View style={styles.paragraphWrapper}>
                    <BaseText align="center">
                        You'll be able to view and contribute to this list right
                        from your account.
                    </BaseText>
                </View>

                <SubmitButton onPress={onAcceptPress} processing={processing}>
                    Join List
                </SubmitButton>
                <CancelButton onPress={onCancelPress}>Decline</CancelButton>
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        padding: bsl(40),
        flex: 1,
        justifyContent: 'center',
    },
    paragraphWrapper: {
        marginBottom: bsl(40),
    },
});

export default AcceptShare;
