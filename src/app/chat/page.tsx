"use client";

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import ConversationList from '@/components/chat/ConversationList';
import ChatArea from '@/components/chat/ChatArea';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/constants/chat';

const robotoCondensed = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
};


export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const currentConversation = MOCK_CONVERSATIONS.find(c => c.id === selectedConversation);
  const currentMessages = MOCK_MESSAGES;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <Container>
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            <div className="lg:col-span-1">
              <ConversationList
                conversations={MOCK_CONVERSATIONS}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
                robotoCondensed={robotoCondensed}
              />
            </div>

            <div className="lg:col-span-2">
              <ChatArea
                title={currentConversation?.title || ''}
                participant={currentConversation?.participants[0] || { name: '', avatar: '', online: false }}
                messages={currentMessages}
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
