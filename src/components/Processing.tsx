import React from 'react';
import { ActivityIndicator } from 'react-native';

export interface ProcessingProps {}

const Processing: React.FC<ProcessingProps> = (props) => {
    return <ActivityIndicator />;
};

export default Processing;
