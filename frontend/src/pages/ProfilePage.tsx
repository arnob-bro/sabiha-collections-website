import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Profile from "@/components/profile/profile"

// NOTE: The Radix Primitives components are typically imported from scoped packages, 
// e.g., '@radix-ui/react-tabs', not 'radix-ui'. Make sure you installed the correct package:
// npm i @radix-ui/react-tabs


import * as Tabs from '@radix-ui/react-tabs'; 
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProfilePage() {
    return (
        <div>
            <Header />
            <Breadcrumbs />
            {/* //TODO: need to add tab navigation later */}
            {/* <div className="px-5 sm:px-10 md:px-32 min-h-[650px]">
                <Profile />
            </div> */}

            <Tabs.Root defaultValue="account">
            <Tabs.List >
                
                <Tabs.Trigger value="account">Profile</Tabs.Trigger>
                <Tabs.Trigger value="documents">Purchase History</Tabs.Trigger>
                <Tabs.Trigger value="settings">Pending Orders</Tabs.Trigger>
            </Tabs.List>

            <div style={{ marginTop: '10px' }}> {/* Replaced Box and Text with div/p */}
                <Tabs.Content value="account">
                    <Profile />
                </Tabs.Content>

                <Tabs.Content value="documents">
                    <p>Access and update your documents.</p>
                </Tabs.Content>

                <Tabs.Content value="settings">
                    <p>Edit your profile or update contact information.</p>
                </Tabs.Content>
            </div>
        </Tabs.Root>


            <Footer />
        </div>
    )
}



