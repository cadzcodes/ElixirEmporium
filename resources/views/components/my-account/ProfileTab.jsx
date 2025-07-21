import React from 'react';

const ProfileTab = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-modern-negra text-5xl text-yellow">My Profile</h2>
                <p className="text-gray-400">Manage your personal information</p>
                <hr className="mt-4 border-yellow/20" />
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input type="text" className="bg-[#1a1a1a] px-4 py-3 w-full rounded-lg border border-yellow/20 text-white" value="John Doe" readOnly />
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                        <input type="text" className="bg-[#1a1a1a] px-4 py-3 rounded-lg border border-yellow/20 text-white" value="+1 234 567 8901" readOnly />
                    </div>
                    <button className="ml-4 px-4 py-2 bg-yellow text-black rounded-lg hover:bg-white">Change</button>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="gender" className="accent-yellow" checked readOnly />
                            <span>Male</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="gender" className="accent-yellow" readOnly />
                            <span>Female</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                    <input type="date" className="bg-[#1a1a1a] px-4 py-3 w-full rounded-lg border border-yellow/20 text-white" value="1995-10-01" />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                    <input type="text" className="bg-[#1a1a1a] px-4 py-3 w-full rounded-lg border border-yellow/20 text-white" value="joh***@gmail.com" readOnly />
                </div>

                <div className="flex justify-between items-center">
                    <label className="block text-sm text-gray-400">Password</label>
                    <button className="ml-4 px-4 py-2 bg-yellow text-black rounded-lg hover:bg-white">Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
