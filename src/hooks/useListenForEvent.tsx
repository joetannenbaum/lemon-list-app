import { useEffect } from 'react';
import emitter from 'tiny-emitter/instance';

export default (
    event: string,
    func: (args: any) => void,
    dependencies: any[] = [],
) => {
    useEffect(() => {
        emitter.on(event, func);

        return () => {
            emitter.off(event, func);
        };
    }, dependencies);
};
