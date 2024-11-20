"use client"
import { useEffect, useState } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/lib/fireBase/firebase';

export default function NotificationHandler() {
    const [token, setToken] = useState('');
    const [notificationPermission, setNotificationPermission] = useState('default');

    async function requestPermission() {
        try {
            // Check if the browser supports notifications
            if (!('Notification' in window)) {
                console.error('This browser does not support notifications');
                return;
            }

            // Check if service workers are supported
            if (!('serviceWorker' in navigator)) {
                console.error('Service workers are not supported');
                return;
            }

            // Request notification permission
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);

            if (permission === 'granted') {
                // Register service worker
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                    scope: '/'
                });
                console.log('Service Worker registered:', registration);

                // Get FCM token
                const currentToken = await getToken(messaging, {
                    vapidKey: process.env.NEXT_PUBLIC_APP_VAPID_KEY,
                    serviceWorkerRegistration: registration
                });

                if (currentToken) {
                    setToken(currentToken);
                    // Send this token to your server
                    await sendTokenToServer(currentToken);
                } else {
                    console.log('No registration token available');
                }
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }

    // async function sendTokenToServer(token) {
    //     try {
    //         const response = await fetch('/api/save-notification-token', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ token }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to save token');
    //         }

    //         console.log('Token saved successfully');
    //     } catch (error) {
    //         console.error('Error saving token:', error);
    //     }
    // }

    useEffect(() => {
        requestPermission();
    }, []);

    return (
        <div>
            <p>Notification Permission: {notificationPermission}</p>
            {notificationPermission === 'denied' && (
                <p>Please enable notifications in your browser settings to receive updates.</p>
            )}
        </div>
    );
}
