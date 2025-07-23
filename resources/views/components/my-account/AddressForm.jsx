import React, { useState, useEffect } from 'react';

const provinces = [
    "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora",
    "Basilan", "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan",
    "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite",
    "Cebu", "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental",
    "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte",
    "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna", "Lanao del Norte",
    "Lanao del Sur", "Leyte", "Maguindanao del Norte", "Maguindanao del Sur", "Marinduque",
    "Masbate", "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental",
    "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro",
    "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal",
    "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte",
    "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi",
    "Zambales", "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"
];

const addressTypes = ['home', 'work'];

const AddressForm = ({ onSave, onCancel }) => {
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        unitNumber: '',
        province: '',
        city: '',
        barangay: '',
        type: '',
        isDefault: false,
    });


    const [saving, setSaving] = useState(false);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 text-white">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-400">Full Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#111] border border-yellow/20 rounded-lg"
                        value={form.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Mobile Number</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#111] border border-yellow/20 rounded-lg"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm text-gray-400">Street Address</label>
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#111] border border-yellow/20 rounded-lg"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                />
            </div>

            <div>
                <label className="text-sm text-gray-400">Unit / Floor</label>
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#111] border border-yellow/20 rounded-lg"
                    value={form.unitNumber}
                    onChange={(e) => handleChange('unitNumber', e.target.value)}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-400">Province</label>
                    <select
                        className="w-full px-4 py-3 bg-[#111] border border-yellow/20 rounded-lg text-white"
                        value={form.province}
                        onChange={(e) => handleChange('province', e.target.value)}
                    >
                        <option value="">Select province</option>
                        {provinces.map(prov => (
                            <option key={prov} value={prov}>{prov}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm text-gray-400">City</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#111] border border-yellow/20 rounded-lg"
                        value={form.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm text-gray-400">Barangay</label>
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#111] border border-yellow/20 rounded-lg"
                    value={form.barangay}
                    onChange={(e) => handleChange('barangay', e.target.value)}
                />
            </div>

            <div>
                <label className="text-sm text-gray-400">Address Type</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    {addressTypes.map(type => (
                        <div
                            key={type}
                            className={`flex items-center justify-between px-4 py-3 border-4 rounded-xl cursor-pointer ${form.type === type ? 'border-yellow bg-[#2a2a2a]' : 'border-[#2a2a2a] hover:border-yellow/50'}`}
                            onClick={() => handleChange('type', form.type === type ? '' : type)}
                        >
                            <span className="capitalize">{type}</span>
                            {form.type === type ? (
                                <div className="w-5 h-5 bg-yellow rounded-full" />
                            ) : (
                                <div className="w-5 h-5 border border-gray-400 rounded-full" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => handleChange('isDefault', e.target.checked)}
                    className="w-5 h-5 accent-yellow"
                />
                <label className="text-sm text-gray-300">Set as default address</label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        className="px-4 py-2 bg-[#333] border border-gray-600 text-white rounded-lg hover:bg-[#444]"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="button"
                    className="px-4 py-2 bg-yellow text-black font-semibold rounded-lg hover:bg-yellow/90 disabled:opacity-60"
                    onClick={async () => {
                        setSaving(true);
                        try {
                            await onSave(form);
                        } finally {
                            setSaving(false);
                        }
                    }}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Address'}
                </button>

            </div>
        </div>
    );
};

export default AddressForm;
