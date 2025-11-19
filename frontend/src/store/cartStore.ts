import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface CartItem {
    id: string | number
    name: string
    price: number
    quantity?: number
    [key: string]: any
}

interface CartStore {
    cart: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string | number) => void
    clearCart: () => void
}

const useCartStore = create<CartStore>()(
    devtools(
        persist(
            (set) => ({
                cart: [],
                addItem: (item) => {
                    set((state) => ({
                        cart: [item, ...state.cart],
                    }))
                },
                removeItem: (id) => {
                    set((state) => ({
                        cart: state.cart.filter((item) => item.id !== id),
                    }))
                },
                clearCart: () => {
                    set({ cart: [] })
                },
            }),
            {
                name: "cart-storage",
            }
        )
    )
)

export default useCartStore
