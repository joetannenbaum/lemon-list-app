import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import BodyText from '@/components/BodyText';
import Fuse from 'fuse.js';

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

    if (props.query.trim().length < 2) {
        return null;
    }

    return (
        <View style={{ position: 'relative' }}>
            <View style={styles.container}>
                {fuse.current.search(props.query).map((item) => {
                    return (
                        <TouchableOpacity
                            style={{ padding: 10 }}
                            key={item.item.label}
                            onPress={() => props.onSelect(item.item.value)}>
                            <BodyText>{item.item.label}</BodyText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: '#fff',
        zIndex: 100,
    },
});

export default AutoComplete;
