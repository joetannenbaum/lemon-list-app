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
