'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Name</label>
                            <p className="mt-1 text-slate-900 py-2 border-b border-slate-100">{user?.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email</label>
                            <p className="mt-1 text-slate-900 py-2 border-b border-slate-100">{user?.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Role</label>
                            <p className="mt-1 text-slate-900 py-2 border-b border-slate-100 font-bold">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Security</h3>
                    <button className="text-blue-600 font-medium hover:text-blue-700">Change Password</button>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Dark Mode</p>
                            <p className="text-sm text-slate-500">Toggle system-wide dark appearance.</p>
                        </div>
                        <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-slate-200">
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
