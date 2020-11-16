import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import LogoutButton from '@/components/LogoutButton';
import useMe from '@/hooks/useMe';
import SafeAreaView from 'react-native-safe-area-view';
import BodyText from '@/components/BodyText';

interface Props extends ScreenProps {}

const Home: Screen<Props> = (props) => {
    const me = useMe();

    return (
        <SafeAreaView>
            <BodyText>Hi, {me?.data?.name}</BodyText>
            <LogoutButton />
        </SafeAreaView>
    );
};

export default Home;
