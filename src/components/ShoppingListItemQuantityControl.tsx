import React, { useState, useEffect } from 'react';
import QuantityControl from './QuantityControl';

export interface ShoppingListItemQuantityControlProps {
    quantity: number;
    onChange: (newQuantity: number) => void;
    disabled: boolean;
}

const ShoppingListItemQuantityControl: React.FC<ShoppingListItemQuantityControlProps> = (
    props,
) => {
    const [quantity, setQuantity] = useState(props.quantity);

    const increaseQuantity = () => changeQuantity(1);
    const decreaseQuantity = () => changeQuantity(-1);

    const changeQuantity = (by: number) => {
        setQuantity((state) => {
            const newState = Math.max(1, state + by);

            props.onChange(newState);

            return newState;
        });
    };

    useEffect(() => {
        setQuantity(props.quantity);
    }, [props.quantity]);

    return (
        <QuantityControl
            quantity={quantity}
            onIncreasePress={increaseQuantity}
            onDecreasePress={decreaseQuantity}
            disabled={props.disabled}
        />
    );
};

export default ShoppingListItemQuantityControl;
