'use client';

import { ChatLayout } from '@/components/chat/ChatLayout';
import { ChatContentWithAuth } from '@/components/chat/ChatContentWithAuth';

export default function ChatPage() {
  return (
    <ChatLayout>
      <ChatContentWithAuth />
    </ChatLayout>
  );
}