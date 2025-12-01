import Header from "@/components/Header/Header"
import Footer from "@/components/Footer"

export default function CartPage() {
    return (
        <>
            <Header />
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Cart Page</h1>
                <p>Your cart items will appear here.</p>
            </div>
            <Footer />
        </>
    )
}
