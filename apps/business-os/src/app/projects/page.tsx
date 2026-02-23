'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                setProjects(response.data);
            } catch (err) {
                console.error('Failed to fetch projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
                    <p className="text-slate-500">Track tasks, deadlines and team progress.</p>
                </div>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-slate-500">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-slate-500">No projects found.</div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {project.status}
                                </span>
                                <span className="text-slate-400">
                                    {project.status === 'COMPLETED' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-blue-500" />}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{project.name}</h3>
                            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{project.description || 'No description provided.'}</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>Client:</span>
                                    <span className="font-medium text-slate-900">{project.client?.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>Tasks:</span>
                                    <span className="font-medium text-slate-900">{project.tasks?.length || 0} items</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
