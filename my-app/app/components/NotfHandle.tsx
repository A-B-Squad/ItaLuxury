// components/FirebaseNotificationHandler.tsx
'use client';

import { useToast } from "@/components/ui/use-toast";
import { messaging } from "@/lib/fireBase/firebase";
import { getMessaging, getToken, onMessage, MessagePayload } from "firebase/messaging";
import { useEffect } from "react";

const VAPID_KEY = process.env.NEXT_PUBLIC_APP_VAPID_KEY;

export default function FirebaseNotificationHandler() {
    const { toast } = useToast();

    useEffect(() => {
        const setupMessaging = async () => {
            try {
                if (!('Notification' in window)) {
                    console.log('This browser does not support desktop notification');
                    return;
                }

                // Register service worker
                if ('serviceWorker' in navigator) {
                    try {
                        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                            scope: '/'
                        });
                        console.log('Service Worker registered with scope:', registration.scope);

                        // Request notification permission and get token only after SW is registered
                        if (Notification.permission !== 'granted') {
                            const permission = await Notification.requestPermission();
                            if (permission !== 'granted') {
                                console.log('Notification permission not granted');
                                return;
                            }
                        }

                        if (!messaging || !VAPID_KEY) {
                            console.log('Firebase messaging is not initialized or VAPID key is missing');
                            return;
                        }

                        // Get messaging token
                        const token = await getToken(messaging, {
                            vapidKey: VAPID_KEY,
                            serviceWorkerRegistration: registration
                        });
                        console.log('FCM Token:', token);

                        // Set up message handler
                        const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
                            console.log(payload.notification?.title || "Nouvelle notification");

                            toast({
                                title: payload.notification?.title || "Nouvelle notification",
                                description: payload.notification?.body || "",
                            });
                        });

                        return () => {
                            if (typeof unsubscribe === 'function') {
                                unsubscribe();
                            }
                        };
                    } catch (err) {
                        console.error('Error registering service worker:', err);
                    }
                }
            } catch (error) {
                console.error('Error setting up notifications:', error);
            }
        };

        setupMessaging();
    }, [toast]);

    return null;
}