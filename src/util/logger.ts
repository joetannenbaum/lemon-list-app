export default {
    flank(args) {
        this.log(
            '---------------------------------------------------------------',
        );
        this.log(
            '---------------------------------------------------------------',
        );
        this.log(args);
        this.log(
            '---------------------------------------------------------------',
        );
        this.log(
            '---------------------------------------------------------------',
        );
    },

    big(args) {
        this.log('%c' + args, 'font-size: 36px');
    },

    green(args) {
        this.color(args, ['#82ea78;', '\x1b[42m']);
    },

    yellow(args) {
        this.color(args, ['#eae378;', '\x1b[43m']);
    },

    red(args) {
        this.color(args, ['#ea7878;', '\x1b[41m']);
    },

    color(args, background, color = ['#000', '\x1b[30m']) {
        if (this.remoteDebugging()) {
            this.log(
                '%c' + args,
                `background: ${background[0]}; color: ${color[0]};`,
            );
        } else {
            this.log(`\x1b[${background[1]}${args}\x1b[0m`);
        }
    },

    error(message, e) {
        this.red(message);
        this.red(e);
    },

    shouldLog() {
        return __DEV__;
    },

    remoteDebugging() {
        return typeof DedicatedWorkerGlobalScope !== 'undefined';
    },

    log(...args) {
        if (!this.shouldLog()) {
            return;
        }

        console.log(...args);
    },
};
