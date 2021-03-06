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

export const black = '#272727';
export const grey50 = '#F9FAFB';
export const grey100 = '#F3F4F6';
export const grey200 = '#E5E7EB';
export const grey300 = '#D1D5DB';
export const grey400 = '#9CA3AF';
export const grey500 = '#6B7280';
export const grey600 = '#4B5563';
export const grey700 = '#374151';
export const grey800 = '#1F2937';
export const grey900 = '#111827';
export const yellow100 = '#FEF3C7';
export const yellow200 = '#FCD34D';
export const red400 = '#F87171';
export const blue400 = '#60A5FA';
export const green600 = '#059669';

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

export const marginX = (
    val: number,
): { marginLeft: number; marginRight: number } => ({
    marginLeft: bsl(val),
    marginRight: bsl(val),
});

export const marginY = (
    val: number,
): { marginTop: number; marginBottom: number } => ({
    marginTop: bsl(val),
    marginBottom: bsl(val),
});

export const paddingX = (
    val: number,
): { paddingLeft: number; paddingRight: number } => ({
    paddingLeft: bsl(val),
    paddingRight: bsl(val),
});

export const paddingY = (
    val: number,
): { paddingTop: number; paddingBottom: number } => ({
    paddingTop: bsl(val),
    paddingBottom: bsl(val),
});

const getLetterIndex = (str: string) => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const index = letters.indexOf(str.toLowerCase().substr(0, 1));

    return index >= 0 ? index : 0;
};

export const getColorFromString = (str: string) => {
    const userFallbackColors = [
        '#F87171', // red
        '#FBBF24', // yellow
        '#10B981', // green
        '#60A5FA', // blue
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
