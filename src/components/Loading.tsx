import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export interface LoadingProps {}

const Loading: React.FC<LoadingProps> = (props) => {
    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
        </View>
    );
};

export default Loading;
