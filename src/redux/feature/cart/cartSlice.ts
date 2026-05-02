import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";

// Product type define kora
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  img: string;
  desc?: string;
  slug?: string;
}

interface CartState {
  items: CartItem[];
}

// LocalStorage theke data load kora
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
      
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string | number; delta: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.qty = Math.max(1, item.qty + action.payload.delta);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;