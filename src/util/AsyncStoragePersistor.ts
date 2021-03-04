import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Persistor,
    PersistedClient,
} from 'react-query/types/persistQueryClient-experimental';
import debounce from 'lodash/debounce';

const storageKey = 'LEMON_LIST_QUERY_CACHE';

const debouncedUpdate = debounce(
    (params: PersistedClient) =>
        AsyncStorage.setItem(storageKey, JSON.stringify(params)),
    1000,
);

const AsyncStoragePersistor: Persistor = {
    persistClient(persistClient: PersistedClient): Promise<void> {
        return debouncedUpdate(persistClient);
    },

    restoreClient(): Promise<PersistedClient | undefined> {
        return AsyncStorage.getItem(storageKey).then((val) => {
            if (val === null) {
                return undefined;
            }

            console.log(val);

            return JSON.parse(val);
        });
    },

    removeClient(): Promise<void> {
        return AsyncStorage.removeItem(storageKey);
    },
};

export default AsyncStoragePersistor;
