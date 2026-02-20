import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/core/firebase/firebase.client';

export const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'page_view', {
                page_path: location.pathname,
                page_title: location.pathname.replace('/', '').toUpperCase() || 'HOME'
            });
        }
    }, [location]);

    return null;
};