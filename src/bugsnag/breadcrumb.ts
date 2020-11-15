import Bugsnag from '@bugsnag/react-native';
import truncate from 'lodash/truncate';

export default {
    leaveBreadcrumb(type: string, label: string, data = {}) {
        data.type = type;

        label = truncate(label, {
            length: 30,
            omission: '',
        });

        return Bugsnag.leaveBreadcrumb(label, data);
    },
    process(label: string, data = {}) {
        return this.leaveBreadcrumb('process', label, data);
    },
    navigation(label: string, data = {}) {
        return this.leaveBreadcrumb('navigation', label, data);
    },
    error(label: string, data = {}) {
        return this.leaveBreadcrumb('error', label, data);
    },
    log(label: string, data = {}) {
        return this.leaveBreadcrumb('log', label, data);
    },
    request(label: string, data = {}) {
        return this.leaveBreadcrumb('request', label, data);
    },
    state(label: string, data = {}) {
        return this.leaveBreadcrumb('state', label, data);
    },
    user(label: string, data = {}) {
        return this.leaveBreadcrumb('user', label, data);
    },
    manual(label: string, data = {}) {
        return this.leaveBreadcrumb('manual', label, data);
    },
};
