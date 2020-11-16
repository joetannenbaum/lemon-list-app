import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import LogoutButton from '@/components/LogoutButton';
import useMe from '@/hooks/useMe';
import SafeAreaView from 'react-native-safe-area-view';
import BodyText from '@/components/BodyText';
import useLists from '@/hooks/useShoppingLists';
import { View, TouchableOpacity } from 'react-native';
import CreateListForm from '@/components/CreateListForm';

interface Props extends ScreenProps {}

const Home: Screen<Props> = (props) => {
    const me = useMe();
    const lists = useLists();

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
                    <TouchableOpacity key={`${list.id}`}>
                        <BodyText>{list.name}</BodyText>
                    </TouchableOpacity>
                );
            })}
            <LogoutButton />
        </SafeAreaView>
    );
};

export default Home;
