import Header from "@/components/Header/Header"
import Footer from "@/components/Footer"
import Profile from "@/components/Profile/Profile"
import Breadcrumbs from "@/components/Breadcrumbs"
import PurchaseHistory from "@/components/Profile/PurchaseHistory"
import PendingOrders from "@/components/Profile/PendingOrders"
import * as Tabs from "@radix-ui/react-tabs"

export default function ProfilePage() {
    return (
        <div>
            <Header />

            <div className="flex-1 px-5 sm:px-10 md:px-32 py-4 bg-gray-50 min-h-[650px]">
                <Breadcrumbs />
                <div className=" mx-auto">
                    <Tabs.Root defaultValue="account" className="w-full">
                        <Tabs.List className="inline-flex h-10 items-center justify-center rounded-lg bg-white p-1 border border-gray-200 shadow-sm mb-6">
                            <Tabs.Trigger
                                value="account"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:text-gray-600 hover:text-gray-900">
                                Profile
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="documents"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:text-gray-600 hover:text-gray-900">
                                Purchase History
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="settings"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow data-[state=inactive]:text-gray-600 hover:text-gray-900">
                                Pending Orders
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content
                            value="account"
                            className=" ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                            {/* //*Profile */}
                            <Profile />
                        </Tabs.Content>

                        <Tabs.Content
                            value="documents"
                            className="mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                            {/* //* Purchase history */}
                            <PurchaseHistory />
                        </Tabs.Content>

                        <Tabs.Content
                            value="settings"
                            className="mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                            {/* //* Pending orders */}
                            <PendingOrders />
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>

            <Footer />
        </div>
    )
}
