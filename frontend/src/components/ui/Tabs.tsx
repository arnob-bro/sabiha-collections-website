import * as Tabs from '@radix-ui/react-tabs'; 
// NOTE: The Radix Primitives components are typically imported from scoped packages, 
// e.g., '@radix-ui/react-tabs', not 'radix-ui'. Make sure you installed the correct package:
// npm i @radix-ui/react-tabs

export default function MyTabs () {
    return (
        <Tabs.Root defaultValue="account">
            <Tabs.List>
                <Tabs.Trigger value="account">Account</Tabs.Trigger>
                <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>

            <div style={{ marginTop: '10px' }}> {/* Replaced Box and Text with div/p */}
                <Tabs.Content value="account">
                    <p>Make changes to your account.</p>
                </Tabs.Content>

                <Tabs.Content value="documents">
                    <p>Access and update your documents.</p>
                </Tabs.Content>

                <Tabs.Content value="settings">
                    <p>Edit your profile or update contact information.</p>
                </Tabs.Content>
            </div>
        </Tabs.Root>
    )
}