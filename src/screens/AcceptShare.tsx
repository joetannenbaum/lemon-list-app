import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import { View, Button } from 'react-native';
import Loading from '@/components/Loading';
import api from '@/api';
import BaseText from '@/components/BaseText';
import { ShoppingList } from '@/types/ShoppingList';
import { useQueryClient, useMutation } from 'react-query';
import { Navigation } from 'react-native-navigation';

export interface AcceptShareProps {
    listUuid: string;
}

const AcceptShare: Screen<AcceptShareProps & ScreenProps> = (props) => {
    const [list, setList] = useState<ShoppingList | null>(null);

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
            setList(res.data);
        });
    }, []);

    const onAcceptPress = () => {
        joinList().then(() => {
            Navigation.dismissModal(props.componentId);
        });
    };

    const onCancelPress = () => Navigation.dismissModal(props.componentId);

    if (list === null) {
        return <Loading />;
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <BaseText>
                    Do you want to add {list.name} to your lists?
                </BaseText>
                <BaseText>
                    You'll be able to view and contribute to this list right
                    from your account.
                </BaseText>

                <Button title="Accept" onPress={onAcceptPress} />
                <View style={{ padding: 20 }}>
                    <Button title="Cancel" onPress={onCancelPress} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AcceptShare;
