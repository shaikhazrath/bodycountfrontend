'use client';
import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner'; // Custom Spinner component
import { Check, ChevronLeft, Edit, Save } from 'lucide-react';
import Link from 'next/link';

const UserProfile = () => {
    const [goals, setGoals] = useState({
        Calories: 0,
        Fats: 0,
        Protein: 0,
        Carbs: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState(goals);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userId = (await supabase.auth.getUser()).data.user?.id;
                const userData = (await supabase.auth.getUser()).data.user.identities[0].identity_data;
                setUser(userData);

                if (!userId) throw new Error('No authenticated user found.');

                const { data, error } = await supabase
                    .from('user_goals')
                    .select('Calories, Fats, Protein, Carbs')
                    .eq('user', userId);

                if (error) throw error;

                if (data.length === 0) {
                    await handleCreate(userId);
                } else {
                    const filteredData = {
                        Calories: data[0].Calories || 0,
                        Fats: data[0].Fats || 0,
                        Protein: data[0].Protein || 0,
                        Carbs: data[0].Carbs || 0,
                    };
                    setGoals(filteredData);
                    setUpdatedData(filteredData);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleCreate = async (userId) => {
        await supabase.from('user_goals').insert([{ user: userId, ...goals }]);
    };

    const handleUpdate = async () => {
        setSaving(true);
        try {
            const userId = (await supabase.auth.getUser()).data.user?.id;

            const { error } = await supabase
                .from('user_goals')
                .update(updatedData)
                .eq('user', userId);

            if (error) throw error;

            setGoals(updatedData);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            setError('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Spinner className="text-white w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center px-4">
            <Link href='/app' className='flex flex-start w-full pt-4'>
                <ChevronLeft color='white'/>
                <h1 className='text-white text-bold font-semibold'>bodycount</h1>
            </Link>
            <div className="max-w-md w-full p-4 bg-white/10 rounded-lg shadow-lg mt-6">
                {error && (
                    <div className="mb-4 p-2 text-red-500 bg-red-100 rounded-md">{error}</div>
                )}
                <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-24 h-24 border-2 border-white mb-4">
                        <AvatarImage src={user?.picture} />
                        <AvatarFallback className="text-white">U</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold text-center">{user?.full_name || 'User'}</h1>
                    <p className="text-gray-300 text-sm">{user?.email}</p>
                </div>
<div className='flex justify-between items-end  pb-2'>
<h2 className="text-xl font-semibold text-gray-200 mb-4">Goals</h2>
                {isEditing ? (
                    <Button
                        onClick={handleUpdate}
                        disabled={saving}
                        className={` ${saving ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {saving ? 'Saving...' : <Check/>}
                    </Button>
                ) : (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className=" bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                        <Edit/>
                    </Button>
                )}
</div>

                <div className="grid grid-cols-2 gap-4">
                    {['Calories', 'Fats', 'Protein', 'Carbs'].map((field) => (
                        <div key={field} className="bg-white/20 p-3 rounded-md">
                            <label className="block text-sm font-medium text-gray-400">{field}</label>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    className="mt-1 block w-full rounded-md bg-black/50 text-white shadow-sm"
                                    value={updatedData[field] || ''}
                                    onChange={(e) =>
                                        setUpdatedData({ ...updatedData, [field]: Number(e.target.value) || 0 })
                                    }
                                />
                            ) : (
                                <p className="mt-1 text-white font-bold">{goals[field]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full fixed bottom-0 bg-black/50 backdrop-blur-md p-4 flex justify-between">
              
                <Button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default UserProfile;
