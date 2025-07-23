import React, { useState, useEffect } from 'react';

const provinces = [
    "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora",
    "Basilan", "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan",
    "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite",
    "Cebu", "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental",
    "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte",
    "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna", "Lanao del Norte",
    "Lanao del Sur", "Leyte", "Maguindanao del Norte", "Maguindanao del Sur", "Marinduque",
    "Masbate", "Metro Manila", "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental",
    "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro",
    "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal",
    "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte",
    "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi",
    "Zambales", "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"
];

const addressTypes = ['home', 'work'];

const AddressForm = ({ onSave, onCancel, onDelete, initialData = {}, isEditing = false }) => {
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


    useEffect(() => {
        if (isEditing && initialData) {
            const parts = initialData.address2?.split(',').map(p => p.trim()) || [];

            setForm({
                fullName: initialData.name || '',
                phone: initialData.phone || '',
                address: initialData.address1 || '',
                unitNumber: parts[0] || '',
                barangay: parts[1] || '',
                city: parts[2] || '',
                province: parts[3] || '',
                type: initialData.type || '',
                isDefault: initialData.default || false,
            });
        }
    }, [initialData, isEditing]);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [saving, setSaving] = useState(false);

    const validateField = (field, value) => {
        let error = '';

        switch (field) {
            case 'fullName':
                if (!value.trim()) error = 'Name is required';
                else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
                break;
            case 'phone':
                if (!value.trim()) error = 'Phone number is required';
                else if (!/^\d+$/.test(value)) error = 'Phone number must contain digits only';
                else if (value.trim().length !== 11) error = 'Phone number must be 11 digits';
                break;
            case 'address':
                if (!value.trim()) error = 'Street address is required';
                break;
            case 'province':
                if (!value) error = 'Province is required';
                break;
            case 'city':
                if (!value.trim()) error = 'City is required';
                break;
            case 'barangay':
                if (!value.trim()) error = 'Barangay is required';
                break;
            case 'type':
                // Address type is now optional; no validation needed
                break;
        }

        return error;
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));

        // Re-validate when typing
        setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({ ...prev, [field]: validateField(field, form[field]) }));
    };

    const isValid = () => {
        const newErrors = {};
        for (const key in form) {
            if (key === 'unitNumber' || key === 'isDefault' || key === 'type') continue;
            const err = validateField(key, form[key]);
            if (err) newErrors[key] = err;
        }
        setErrors(newErrors);
        setTouched(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="space-y-6 text-white">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-400">Full Name</label>
                    <input
                        type="text"
                        className={`w-full px-4 py-3 bg-[#111] border rounded-lg ${errors.fullName && touched.fullName ? 'border-red-500' : 'border-yellow/20'}`}
                        value={form.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        onBlur={() => handleBlur('fullName')}
                    />
                    {errors.fullName && touched.fullName && (
                        <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                    )}
                </div>
                <div>
                    <label className="text-sm text-gray-400">Mobile Number</label>
                    <input
                        type="text"
                        maxLength="11"
                        className={`w-full px-4 py-3 bg-[#111] border rounded-lg ${errors.phone && touched.phone ? 'border-red-500' : 'border-yellow/20'}`}
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                        onBlur={() => handleBlur('phone')}
                    />
                    {errors.phone && touched.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="text-sm text-gray-400">Street Address</label>
                <input
                    type="text"
                    className={`w-full px-4 py-3 bg-[#111] border rounded-lg ${errors.address && touched.address ? 'border-red-500' : 'border-yellow/20'}`}
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                />
                {errors.address && touched.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
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
                        className={`w-full px-4 py-3 bg-[#111] border rounded-lg text-white ${errors.province && touched.province ? 'border-red-500' : 'border-yellow/20'}`}
                        value={form.province}
                        onChange={(e) => handleChange('province', e.target.value)}
                        onBlur={() => handleBlur('province')}
                    >
                        <option value="">Select province</option>
                        {provinces.map(prov => (
                            <option key={prov} value={prov}>{prov}</option>
                        ))}
                    </select>
                    {errors.province && touched.province && (
                        <p className="text-sm text-red-500 mt-1">{errors.province}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm text-gray-400">City</label>
                    <input
                        type="text"
                        className={`w-full px-4 py-3 bg-[#111] border rounded-lg ${errors.city && touched.city ? 'border-red-500' : 'border-yellow/20'}`}
                        value={form.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                    />
                    {errors.city && touched.city && (
                        <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="text-sm text-gray-400">Barangay</label>
                <input
                    type="text"
                    className={`w-full px-4 py-3 bg-[#111] border rounded-lg ${errors.barangay && touched.barangay ? 'border-red-500' : 'border-yellow/20'}`}
                    value={form.barangay}
                    onChange={(e) => handleChange('barangay', e.target.value)}
                    onBlur={() => handleBlur('barangay')}
                />
                {errors.barangay && touched.barangay && (
                    <p className="text-sm text-red-500 mt-1">{errors.barangay}</p>
                )}
            </div>

            <div>
                <label className="text-sm text-gray-400">Address Type</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    {addressTypes.map(type => (
                        <div
                            key={type}
                            className={`flex items-center justify-between px-4 py-3 border-4 rounded-xl cursor-pointer ${form.type === type ? 'border-yellow bg-[#2a2a2a]' : 'border-[#2a2a2a] hover:border-yellow/50'}`}
                            onClick={() => {
                                handleChange('type', form.type === type ? '' : type);
                                handleBlur('type');
                            }}
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

            {!isEditing && (
                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="default"
                        className="w-5 h-5"
                        checked={form.isDefault}
                        onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                    />
                    <label htmlFor="default" className="text-white">
                        Set as default address
                    </label>
                </div>
            )}



            <div className="flex justify-end items-center pt-4">

                <div className="flex gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 bg-[#333] border border-gray-600 text-white rounded-lg hover:bg-[#444]"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-yellow text-black font-semibold rounded-lg hover:bg-yellow/90 disabled:opacity-60"
                        onClick={async () => {
                            if (!isValid()) return;
                            setSaving(true);
                            try {
                                await onSave(form);
                            } finally {
                                setSaving(false);
                            }
                        }}
                        disabled={saving}
                    >
                        {saving ? (isEditing ? 'Saving Changes...' : 'Saving...') : isEditing ? 'Save Changes' : 'Save Address'}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AddressForm;