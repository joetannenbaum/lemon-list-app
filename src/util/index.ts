import { move } from 'formik';

export type MoveDirection = -2 | -1 | 1 | 2;

export const reorderState = (
    state: any[],
    index: number,
    direction: MoveDirection,
    reorderFunc: ({ order }: { order: any[] }) => void,
) => {
    console.log(index, direction, state);

    let newState;

    if (direction === -2) {
        newState = move(state, index, 0);
    } else if (direction === 2) {
        newState = move(state, index, state.length);
    } else {
        newState = move(state, index, index + direction);
    }

    reorderFunc({
        order: newState.map((item) => item.id),
    });

    return newState;
};
