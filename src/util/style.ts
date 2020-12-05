import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = (() => {
    const { width, height } = Dimensions.get('window');

    if (width === 0) {
        // We're probably in share extension, use screen instead
        return Dimensions.get('screen');
    }

    return { width, height };
})();

/**
 *
 * When iPhone 11 simulator is Point and Pixel accurate,
 * bsl(100) = 54, therefore:
 *
 * bsl(x * 1.85) = x
 *
 */
const rem = screenWidth / 750;

export const bsl = (size: number) => rem * size;

export const lightGrey = '#F3F4F6';
export const black = '#272727';

export const flexCenter: {
    alignItems: 'center';
    justifyContent: 'center';
} = {
    alignItems: 'center',
    justifyContent: 'center',
};

export const centeredRow: {
    flexDirection: 'row';
    alignItems: 'center';
} = {
    flexDirection: 'row',
    alignItems: 'center',
};

export const sizeImage = (
    width: number,
    height: number,
    scaleTo: {
        width?: number;
        height?: number;
    } = {},
): { width: number; height: number } => {
    if (scaleTo.height) {
        return {
            width: bsl((scaleTo.height / height) * width),
            height: bsl(scaleTo.height),
        };
    }

    if (scaleTo.width) {
        return {
            width: bsl(scaleTo.width),
            height: bsl((scaleTo.width / width) * height),
        };
    }

    return {
        width: bsl(width),
        height: bsl(height),
    };
};

const getLetterIndex = (str: string) => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const index = letters.indexOf(str.toLowerCase().substr(0, 1));

    return index >= 0 ? index : 0;
};

export const getColorFromString = (str: string) => {
    const userFallbackColors = [
        '#FECACA', // red
        '#FDE68A', // yellow
        '#A7F3D0', // green
        '#BFDBFE', // blue
        // '#C7D2FE', // indigo
        // '#DDD6FE', // purple
        // '#FBCFE8', // pink
    ];

    const index =
        (str || '')
            .split('')
            .reduce((prev, current) => prev + getLetterIndex(current), 0) %
        userFallbackColors.length;

    return userFallbackColors[index];
};
