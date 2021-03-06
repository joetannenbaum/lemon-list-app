import React from 'react';
import { View, StyleSheet } from 'react-native';
import { centeredRow, bsl } from '@/util/style';

export interface FooterToolsProps {
    center?: boolean;
}

const FooterTools: React.FC<FooterToolsProps> = (props) => {
    const validKids = props.children.filter((item) => item !== false);

    const aFewKids = validKids.length < 4;

    return (
        <View
            style={[
                styles.toolsWrapper,
                aFewKids ? { justifyContent: 'center' } : null,
            ]}>
            {validKids.map((kid, index) => {
                if (aFewKids) {
                    return (
                        <View
                            style={styles.footerToolWrapper}
                            key={index.toString()}>
                            {kid}
                        </View>
                    );
                }

                return kid;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    toolsWrapper: {
        ...centeredRow,
        paddingHorizontal: bsl(40),
        paddingVertical: bsl(20),
        justifyContent: 'space-between',
    },
    footerToolWrapper: {
        marginHorizontal: bsl(40),
    },
});

export default FooterTools;
