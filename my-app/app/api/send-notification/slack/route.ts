import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { orderId, total, itemCount } = await request.json();

        const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

        if (!slackWebhookUrl) {
            return NextResponse.json(
                { success: false, error: 'Slack configuration missing' },
                { status: 500 }
            );
        }

        const message = {
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `🛍️ *New Order*`
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*ID:* ${orderId}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Time:* ${new Date().toLocaleTimeString()}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Total:* ${total}DT`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Items:* ${itemCount}`
                        }
                    ]
                }
            ]
        };

        const response = await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error(`Slack API error: ${response.status}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Slack notification error:', error);
        return NextResponse.json(
            { success: false, error: String(error) },
            { status: 500 }
        );
    }
}