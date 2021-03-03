import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import BaseText from '@/components/BaseText';
import Fuse from 'fuse.js';
import { bsl, grey100 } from '@/util/style';

interface AutoCompleteData {
    label: string;
    value: any;
}

export interface AutoCompleteProps {
    data: AutoCompleteData[];
    query: string;
    onSelect: (value: any) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
    const fuseOptions: Fuse.IFuseOptions<AutoCompleteData> = {
        keys: ['label'],
        threshold: 0.5,
    };

    const fuse = useRef(new Fuse(props.data, fuseOptions));

    useEffect(() => {
        // When data chanages, update fuse instance
        fuse.current = new Fuse(props.data, fuseOptions);
    }, [props.data]);

    const results = fuse.current.search(props.query);

    if (props.query.trim().length < 2 || results.length === 0) {
        return null;
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.innerWrapper}>
                <View style={styles.buffer} />
                {results.map((item) => {
                    return (
                        <TouchableOpacity
                            style={{ padding: 10 }}
                            key={item.item.label}
                            onPress={() => props.onSelect(item.item)}>
                            <BaseText>{item.item.label}</BaseText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    innerWrapper: {
        paddingBottom: bsl(50),
        position: 'absolute',
        left: bsl(20),
        right: bsl(20),
        bottom: bsl(30),
        backgroundColor: grey100,
        borderTopRightRadius: bsl(20),
        borderTopLeftRadius: bsl(20),
    },
    buffer: {
        height: bsl(10),
    },
});

export default AutoComplete;
