import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, serverTimestamp, update, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const getRooms = searchParams.get('getRooms');

    // Handle getting rooms list
    if (getRooms === 'true') {
      return new Promise((resolve) => {
        const roomsRef = ref(database, 'chatRooms');
        
        onValue(roomsRef, (snapshot) => {
          const data = snapshot.val();
          let rooms: any[] = [];
          
          if (data) {
            rooms = Object.entries(data).map(([id, room]: [string, any]) => ({
              id,
              name: room.name,
              lastMessage: room.lastMessage,
              address: room.participantAddress,
              commitment: room.commitment,
              role: room.participantRole,
              chatAccepted: room.chatAccepted,
              creatorAddress: room.creatorAddress,
              participantAddress: room.participantAddress
            }));
          }
          
          off(roomsRef, 'value');
          resolve(NextResponse.json({ success: true, rooms }));
        });
      });
    }

    // Handle getting messages (original logic)
    const roomIdForMessages = roomId || 'general';
    console.log('Fetching messages for roomId:', roomIdForMessages);
    return new Promise((resolve) => {
      const messagesRef = ref(database, `chats/${roomIdForMessages}/messages`);
      
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Firebase data for room', roomIdForMessages, ':', data);
        let messages: any[] = [];
        
        if (data) {
          messages = Object.entries(data).map(([id, message]: [string, any]) => ({
            id,
            text: message.text,
            sender: message.sender,
            timestamp: message.timestamp,
            senderId: message.senderId,
            replyTo: message.replyTo || null,
          }));
          
          messages.sort((a, b) => a.timestamp - b.timestamp);
        }
        
        console.log('Processed messages:', messages);
        off(messagesRef, 'value');
        resolve(NextResponse.json({ messages }));
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      roomId, 
      text, 
      sender, 
      senderId,
      replyTo,
      // Room creation fields
      name,
      commitment,
      address,
      role,
      creatorId,
      creatorAddress,
      creatorCommitment,
      // Accept room fields
      acceptRoom,
      roomIdToAccept
    } = await request.json();

    // Handle room creation
    if (name && commitment && address && creatorId) {
      console.log('Creating room with data:', { name, commitment, address, creatorId });
      
      const roomsRef = ref(database, 'chatRooms');
      
      const newRoom = {
        name,
        commitment,
        participantId: address,
        participantAddress: address,
        participantRole: role,
        creatorId,
        creatorAddress,
        creatorCommitment,
        chatAccepted: false,
        createdAt: serverTimestamp(),
        lastMessage: 'Phòng mới được tạo'
      };

      console.log('New room object:', newRoom);

      // Check if room already exists between these two commitments
      return new Promise((resolve) => {
        onValue(roomsRef, (snapshot) => {
          const data = snapshot.val();
          let existingRoom = null;
          
          if (data) {
            existingRoom = Object.values(data).find((room: any) => 
              (room.creatorAddress === creatorId && room.participantAddress === address) ||
              (room.creatorAddress === address && room.participantAddress === creatorId)
            );
          }
          
          off(roomsRef, 'value');
          
          if (existingRoom) {
            console.log('Room already exists:', existingRoom);
            resolve(NextResponse.json({ 
              success: false, 
              error: 'Phòng chat với commitment này đã tồn tại' 
            }));
            return;
          }
          
          // Create new room
          push(roomsRef, newRoom).then((roomRef) => {
            const newRoomId = roomRef.key;
            console.log('Room created with ID:', newRoomId);

            resolve(NextResponse.json({ 
              success: true, 
              roomId: newRoomId,
              room: { id: newRoomId, ...newRoom }
            }));
          }).catch((error) => {
            console.error('Error creating room:', error);
            resolve(NextResponse.json({ 
              success: false, 
              error: `Failed to create room: ${error.message}` 
            }, { status: 500 }));
          });
        });
      });
    }

    // Handle accept room
    if (acceptRoom && roomIdToAccept) {
      console.log('Accepting room:', roomIdToAccept);
      
      const roomRef = ref(database, `chatRooms/${roomIdToAccept}`);
      
      return new Promise((resolve) => {
        onValue(roomRef, (snapshot) => {
          const roomData = snapshot.val();
          
          off(roomRef, 'value');
          
          if (!roomData) {
            resolve(NextResponse.json({ 
              success: false, 
              error: 'Room không tồn tại' 
            }));
            return;
          }
          
          // Update room to accepted
          const updatedRoom = {
            ...roomData,
            chatAccepted: true,
            acceptedAt: serverTimestamp()
          };
          
          update(roomRef, updatedRoom).then(() => {
            console.log('Room accepted successfully');
            resolve(NextResponse.json({ 
              success: true, 
              message: 'Room đã được accept' 
            }));
          }).catch((error) => {
            console.error('Error accepting room:', error);
            resolve(NextResponse.json({ 
              success: false, 
              error: `Failed to accept room: ${error.message}` 
            }, { status: 500 }));
          });
        });
      });
    }

    // Handle message sending
    if (!text || !sender || !senderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const messagesRef = ref(database, `chats/${roomId || 'general'}/messages`);
    
    const newMessage = {
      text: text.trim(),
      sender,
      senderId,
      timestamp: serverTimestamp(),
      replyTo: replyTo || null,
    };

    await push(messagesRef, newMessage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { messageId, roomId } = await request.json();
    console.log('DELETE API called with:', { messageId, roomId });

    if (!messageId || !roomId) {
      console.log('Missing messageId or roomId');
      return NextResponse.json({ error: 'Message ID and Room ID are required' }, { status: 400 });
    }

    const messageRef = ref(database, `chats/${roomId}/messages/${messageId}`);
    console.log('Deleting from Firebase path:', `chats/${roomId}/messages/${messageId}`);
    
    await remove(messageRef);
    console.log('Message deleted successfully from Firebase');

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
