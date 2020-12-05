import React from 'react';
import BaseText, { BaseTextProps } from './BaseText';

const BodyText: React.FC<BaseTextProps> = (props) => (
    <BaseText maxFontSizeMultiplier={1} allowFontScaling={false} {...props}>
        {props.children}
    </BaseText>
);

export default BodyText;
