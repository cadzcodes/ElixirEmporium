// UserStatus.js
import { useState, useEffect } from 'react';

const useUserStatus = () => {
    const [user, setUser] = useState(() => {
        return window.__USER__ ?? null;
    });
    const [loading, setLoading] = useState(window.__USER__ === undefined);

    useEffect(() => {
        if (window.__USER__ !== undefined) return;

        fetch('/user', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
};

export default useUserStatus;
