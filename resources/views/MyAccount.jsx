import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import ProfileTab from "./components/my-account/ProfileTab";
import AddressBook from "./components/my-account/AddressBook";
import MyOrders from "./components/my-account/MyOrders";
import Navbar from "./components/Navbar";
import { AlertTriangle } from 'lucide-react';
import AlertDialog from './components/reusables/AlertDialog';

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [pendingTab, setPendingTab] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const profileRef = useRef();

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'addresses', label: 'Address Book' },
        { id: 'orders', label: 'My Orders' },
    ];

    const handleTabClick = (tabId) => {
        if (activeTab === 'profile' && unsavedChanges) {
            setPendingTab(tabId);
            setShowPrompt(true);
        } else {
            setActiveTab(tabId);
        }
    };

    const handleSaveAndSwitch = async () => {
        const success = await profileRef.current?.handleSave();
        if (success) {
            setShowPrompt(false);
            setUnsavedChanges(false);
            setActiveTab(pendingTab);
        }
    };

    const handleDiscard = () => {
        profileRef.current?.resetForm(); // reset form to saved version
        setShowPrompt(false);
        setUnsavedChanges(false);
        setActiveTab(pendingTab);
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-[#0e0e0e] text-white flex pt-24 px-6 md:px-16 pb-32">

                {/* Sidebar */}
                <aside className="w-64 sticky top-32 space-y-4 border-r border-yellow/30 pr-6 hidden lg:block">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`block w-full text-left text-lg font-semibold py-3 px-4 rounded-xl transition-all 
                                ${activeTab === tab.id ? 'bg-yellow text-black' : 'bg-[#1a1a1a] hover:bg-yellow/20'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Right Side - Floating Box */}
                <main className="flex-1 lg:pl-12">
                    <div className="w-full bg-[#111111] rounded-2xl border border-yellow/20 shadow-2xl p-6 md:p-10 space-y-6 transition-all duration-500">
                        {activeTab === 'profile' && (
                            <ProfileTab
                                ref={profileRef}
                                setUnsaved={setUnsavedChanges}
                            />
                        )}
                        {activeTab === 'addresses' && <AddressBook />}
                        {activeTab === 'orders' && <MyOrders />}
                    </div>
                </main>
            </div>

            {showPrompt && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-[#1a1a1a] border border-yellow/30 p-6 rounded-2xl w-[90%] max-w-md shadow-2xl text-white">
                        <div className="flex items-center gap-3 mb-4 text-yellow">
                            <AlertTriangle />
                            <h3 className="text-lg font-bold">Unsaved Changes</h3>
                        </div>
                        <p className="text-sm mb-6">You have unsaved changes. Would you like to save them before switching tabs?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowPrompt(false)}
                                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDiscard}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSaveAndSwitch}
                                className="px-4 py-2 rounded-lg bg-yellow hover:bg-yellow/90 text-black font-semibold"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const rootElement = document.getElementById('myAccount');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<MyAccount />);
} else {
    console.error("No element with id 'myAccount' found.");
}
