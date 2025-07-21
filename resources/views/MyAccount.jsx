import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ProfileTab from "./components/my-account/ProfileTab";
import AddressBook from "./components/my-account/AddressBook";
import MyOrders from "./components/my-account/MyOrders";
import Navbar from "./components/Navbar";

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'addresses', label: 'Address Book' },
        { id: 'orders', label: 'My Orders' },
    ];

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-[#0e0e0e] text-white flex pt-24 px-6 md:px-16 pb-32">

                {/* Sidebar */}
                <aside className="w-64 sticky top-32 space-y-4 border-r border-yellow/30 pr-6 hidden lg:block">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
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
                        {activeTab === 'profile' && <ProfileTab />}
                        {activeTab === 'addresses' && <AddressBook />}
                        {activeTab === 'orders' && <MyOrders />}
                    </div>
                </main>
            </div>
        </div>
    );
};

const rootElement = document.getElementById('myAccount');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<MyAccount />);
} else {
    console.error("No element with id 'myAccount' found.");
}
