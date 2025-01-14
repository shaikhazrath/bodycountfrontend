// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const router = useRouter();

    const fetchSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
            setIsAuthenticated(false);
            router.push('/auth');
        } else {
            setIsAuthenticated(true);
        }
    };

    useEffect(() => {
        fetchSession();
    }, []);

    return isAuthenticated;
};

export default useAuth;
