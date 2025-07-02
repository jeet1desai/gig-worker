import { NextResponse } from 'next/server';
import { sendNotification } from '@/lib/socket/socket-server';
import { getSocketServer } from '@/app/api/socket/route';

export async function GET() {
  try {
    const io = getSocketServer();
    const notificationData = {
      title: 'Test Notification',
      message: 'This is a test notification!',
      module: 'system',
      type: 'info',
    };

    const result = await sendNotification(io, '5', notificationData);
    return NextResponse.json({ success: true, notification: result });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to send notification',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
