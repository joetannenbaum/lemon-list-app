import React from 'react';
import BaseText, { BaseTextProps } from './BaseText';

const BodyText: React.FC<BaseTextProps> = (props) => (
    <BaseText
        maxFontSizeMultiplier={1}
        allowFontScaling={false}
        // textStyle={styles.bodyText}
        {...props}>
        {props.children}
    </BaseText>
);

export default BodyText;
