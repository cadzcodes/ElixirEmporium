import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import axios from 'axios';
import { CheckCircle2, User, UserRound, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import AlertDialog from '../reusables/AlertDialog';
import dayjs from 'dayjs';

const genderIcons = {
    male: <User className="text-yellow w-7 h-7" />,
    female: <UserRound className="text-yellow w-7 h-7" />,
};

const genderOptions = ['male', 'female'];

const ProfileTab = forwardRef((props, ref) => {
    const [user, setUser] = useState(props.userData);
    const unsavedRef = useRef(null);

    useEffect(() => {
        setUser(props.userData);
        setForm(props.userData);  // Sync form too
        setUnsavedChanges(false);
        props.setUnsaved(false);
    }, [props.userData]);

    const [form, setForm] = useState({ ...user });
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', message: '', success: true });
    const [isEmailFocused, setIsEmailFocused] = useState(false);

    useImperativeHandle(ref, () => ({
        handleSave,
        resetForm: () => {
            setForm(user);
            setUnsavedChanges(false);
            props.setUnsaved(false);
        }
    }));

    useEffect(() => {
        if (unsavedChanges && unsavedRef.current) {
            gsap.fromTo(
                unsavedRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        } else if (!unsavedChanges && unsavedRef.current) {
            gsap.to(unsavedRef.current, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: 'power2.in',
            });
        }
    }, [unsavedChanges]);

    const [errors, setErrors] = useState({});
    const validateField = (field, value) => {
        const newErrors = { ...errors };

        switch (field) {
            case 'name':
                if (!value || value.trim().length < 3) {
                    newErrors.name = 'Name must be at least 3 characters';
                } else {
                    delete newErrors.name;
                }
                break;

            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.email = 'Enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;

            case 'phone':
                if (!/^\d{11}$/.test(value)) {
                    newErrors.phone = 'Phone must be exactly 11 digits';
                } else {
                    delete newErrors.phone;
                }
                break;

            case 'date_of_birth':
                const dob = dayjs(value);
                const now = dayjs();
                const age = now.diff(dob, 'year');

                if (!dob.isValid()) {
                    newErrors.date_of_birth = 'Invalid date';
                } else if (dob.isAfter(now)) {
                    newErrors.date_of_birth = 'DOB cannot be in the future';
                } else if (age < 18) {
                    newErrors.date_of_birth = 'You must be at least 18 years old';
                } else {
                    delete newErrors.date_of_birth;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleBlur = (field, value) => {
        validateField(field, value);
    };


    // Detect tab change or close
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (unsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [unsavedChanges]);

    // Detect in-app tab route change (if using react-router)
    useEffect(() => {
        const handleRouteChange = (e) => {
            if (unsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                e.preventDefault();
            }
        };
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, [unsavedChanges]);

    const handleChange = (field, value) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: value };
            const hasChanges = Object.keys(user).some((key) => updated[key] !== user[key]);

            setUnsavedChanges(hasChanges);
            props.setUnsaved(hasChanges);

            return updated;
        });
    };


    const handleSave = async () => {
        // Validate all before save
        ['name', 'email', 'phone', 'date_of_birth'].forEach((field) =>
            validateField(field, form[field])
        );

        if (Object.keys(errors).length > 0) {
            setDialogContent({
                title: 'Validation Error',
                message: 'Please fix the form errors before saving.',
                success: false,
            });
            setShowDialog(true);
            return false;
        }

        try {
            const res = await axios.post('/update-profile', form, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            setUser({ ...form });
            if (props.onUserUpdate) props.onUserUpdate({ ...form });

            setUnsavedChanges(false);
            props.setUnsaved(false);

            setDialogContent({
                title: 'Success!',
                message: 'Profile updated successfully.',
                success: true,
            });
            setShowDialog(true);

            return { ...form };
        } catch (err) {
            console.error(err);
            setDialogContent({
                title: 'Update Failed',
                message: 'Please try again later.',
                success: false,
            });
            setShowDialog(true);
            return false;
        }
    };



    const censoredPhone = user.phone ? user.phone.replace(/.(?=.{3})/g, '*') : 'Not provided';
    const censoredEmail = user.email.replace(/(.{3})(.*)(@.*)/, "$1***$3");

    return (
        <div className="space-y-10 relative pb-32">
            <div>
                <h2 className="font-modern-negra text-5xl text-yellow">My Profile</h2>
                <p className="text-gray-400">Manage your personal information</p>
                <hr className="mt-4 border-yellow/20" />
            </div>

            {unsavedChanges && (
                <div
                    ref={unsavedRef}
                    className="flex items-center gap-2 bg-yellow/10 border border-yellow text-yellow px-4 py-3 rounded-xl"
                >
                    <AlertTriangle className="w-5 h-5" />
                    <span>You have unsaved changes</span>
                </div>
            )}

            <div className="space-y-8">
                {/* Name */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                        type="text"
                        className={`bg-[#1a1a1a] px-4 py-3 w-full rounded-lg border text-white ${errors.name ? 'border-red-500' : 'border-yellow/20'
                            }`}
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={(e) => handleBlur('name', e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>


                {/* Email */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                    <input
                        type="email"
                        className={`bg-[#1a1a1a] px-4 py-3 w-full rounded-lg border text-white ${errors.email ? 'border-red-500' : 'border-yellow/20'
                            }`}
                        value={isEmailFocused || form.email !== user.email ? form.email : censoredEmail}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={(e) => {
                            setIsEmailFocused(false);
                            handleBlur('email', e.target.value);
                        }}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>


                {/* Phone */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        className={`bg-[#1a1a1a] px-4 py-3 w-full rounded-lg border text-white ${errors.phone ? 'border-red-500' : 'border-yellow/20'
                            }`}
                        value={form.phone}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            handleChange('phone', val);
                        }}
                        onBlur={(e) => handleBlur('phone', e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                    <div className="grid grid-cols-2 gap-4">
                        {genderOptions.map((gender, idx) => {
                            const isSelected = form.gender === gender;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleChange('gender', gender)}
                                    className={`flex items-center justify-between px-6 py-5 rounded-2xl cursor-pointer border-4 transition-all duration-200 group ${isSelected
                                        ? 'border-yellow bg-[#2a2a2a]'
                                        : 'border-[#2a2a2a] hover:border-yellow/60'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {genderIcons[gender]}
                                        <span className="text-white capitalize text-lg">{gender}</span>
                                    </div>
                                    {isSelected ? (
                                        <CheckCircle2 className="text-yellow w-6 h-6" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-500 group-hover:border-yellow/50"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                    <input
                        type="date"
                        className={`bg-[#1a1a1a] px-3 py-2 w-1/2 md:w-1/3 rounded-lg border text-white cursor-pointer ${errors.date_of_birth ? 'border-red-500' : 'border-yellow/20'
                            } [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-80`}
                        value={form.date_of_birth}
                        onChange={(e) => handleChange('date_of_birth', e.target.value)}
                        onBlur={(e) => handleBlur('date_of_birth', e.target.value)}
                    />
                    {errors.date_of_birth && (
                        <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
                    )}
                </div>

                {/* Save Button */}
                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        disabled={!unsavedChanges}
                        className={`px-6 py-3 text-black font-bold rounded-xl transition-all duration-200 ${unsavedChanges ? 'bg-yellow hover:bg-white' : 'bg-gray-600 cursor-not-allowed'
                            }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Alert Dialog */}
            {showDialog && dialogContent.message && (
                <AlertDialog
                    type={dialogContent.success ? 'success' : 'error'}
                    message={dialogContent.message}
                    onClose={() => {
                        setShowDialog(false);
                        setDialogContent({ title: '', message: '', success: true });
                    }}
                />
            )}
        </div>
    );
});

export default ProfileTab;
