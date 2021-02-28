import React, { useRef, useEffect } from 'react';
import {
    Animated,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import { bsl } from '@/util/style';
import { Screen, ScreenProps } from '@/types/navigation';
import { Navigation } from 'react-native-navigation';

export interface asModalProps {
    onDismiss: () => void;
}

export interface asModalExportedProps {
    dismiss: () => void;
}

const asModal: (component: React.FC) => Screen<asModalProps & ScreenProps> = (
    BaseComponent,
) => (props) => {
    const animatedValue = useRef(new Animated.Value(0));

    useEffect(() => {
        Animated.spring(animatedValue.current, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }, []);

    const dismiss = () => {
        Animated.timing(animatedValue.current, {
            toValue: 0,
            useNativeDriver: true,
            duration: 250,
        }).start(() => {
            Navigation.dismissOverlay(props.componentId);
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        opacity: animatedValue.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            />
            <TouchableWithoutFeedback onPress={dismiss}>
                <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    styles.wrapper,
                    {
                        transform: [
                            {
                                translateY: animatedValue.current.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [bsl(1000), bsl(40)],
                                }),
                            },
                        ],
                    },
                ]}>
                <BaseComponent {...props} dismiss={dismiss} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        justifyContent: 'flex-end',
    },
    wrapper: {
        backgroundColor: '#fff',
        padding: bsl(40),
        borderRadius: bsl(20),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: bsl(1),
        },
        shadowRadius: bsl(3),
        shadowOpacity: 0.1,
        elevation: 3,
        paddingBottom: bsl(120),
        marginHorizontal: bsl(20),
        maxHeight: bsl(1000),
    },
});

export default asModal;
