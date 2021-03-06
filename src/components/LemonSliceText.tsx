import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { sizeImage, bsl } from '@/util/style';
import BaseText from './BaseText';

export interface LemonSliceTextProps {
    text: string;
}

const LemonSliceText: React.FC<LemonSliceTextProps> = (props) => {
    const [parts, setParts] = useState<string[]>([]);
    const placeholder = '<slice>';

    useEffect(() => {
        const parts = [];
        let text = props.text;

        while (text.indexOf(placeholder) > -1) {
            const index = text.indexOf(placeholder);
            parts.push(text.slice(0, index));
            parts.push(placeholder);
            text = text.slice(index + placeholder.length);
            console.log(text);
        }

        if (text.length > 0) {
            parts.push(text);
        }

        setParts(parts);
    }, [props.text]);

    return (
        <View style={styles.titleWrapper}>
            {parts.map((str, index) => {
                if (str === placeholder) {
                    return (
                        <Image
                            key={str + index.toString()}
                            style={styles.lemonSlice}
                            source={require('@images/lemon-slice-small.png')}
                        />
                    );
                }

                return (
                    <BaseText key={str} size={55}>
                        {str}
                    </BaseText>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    titleWrapper: {
        flexDirection: 'row',
        paddingBottom: bsl(20),
    },
    lemonSlice: {
        ...sizeImage(10, 10, { width: 40 }),
        marginTop: bsl(19),
    },
});

export default LemonSliceText;
