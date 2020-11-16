import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import LogoutButton from '@/components/LogoutButton';

interface Props extends ScreenProps {}

const Home: Screen<Props> = (props) => {
    return <LogoutButton />;
};

export default Home;
