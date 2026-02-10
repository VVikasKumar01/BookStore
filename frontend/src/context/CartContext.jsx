import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existItem = state.cartItems.find(
                (x) => x._id === action.payload._id
            );
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x._id === existItem._id
                            ? { ...x, qty: x.qty + 1 }
                            : x
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, { ...action.payload, qty: 1 }],
                };
            }
        }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (x) => x._id !== action.payload
                ),
            };
        case 'UPDATE_CART_QTY':
            return {
                ...state,
                cartItems: state.cartItems.map((x) =>
                    x._id === action.payload.id
                        ? { ...x, qty: action.payload.qty }
                        : x
                ),
            };
        case 'CLEAR_CART':
            return { ...state, cartItems: [] };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }, [state.cartItems]);

    const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    const updateQty = (id, qty) => dispatch({ type: 'UPDATE_CART_QTY', payload: { id, qty } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const cartTotal = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems: state.cartItems,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
