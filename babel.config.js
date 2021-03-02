module.exports = {
    presets: [
        'module:metro-react-native-babel-preset',
        // {
        //     runtime: 'automatic',
        //     development: process.env.NODE_ENV === 'development',
        //     importSource: '@welldone-software/why-did-you-render',
        // },
    ],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@': './src',
                    '@images': './assets/images',
                },
            },
        ],
    ],
    env: {
        production: {
            plugins: ['transform-remove-console'],
        },
    },
};
