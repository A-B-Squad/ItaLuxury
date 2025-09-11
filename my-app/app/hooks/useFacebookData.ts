"use client";
import { useState, useEffect } from "react";

interface FacebookData {
    domainVerification: string | null;
    api_id: string | null;
}

export const useFacebookData = () => {
    const [fbData, setFbData] = useState<FacebookData>({
        domainVerification: null,
        api_id: null,
    });

    useEffect(() => {
        const fetchFacebookData = async () => {
            try {
                const response = await fetch("/api/facebookApi", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setFbData(data);
            } catch (error) {
                console.error("Error fetching Facebook data:", error);
            }
        };

        fetchFacebookData();
    }, []);

    return fbData;
};