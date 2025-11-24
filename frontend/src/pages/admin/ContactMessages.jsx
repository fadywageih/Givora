import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { dbContactMessages } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Trash2, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    setMessages(dbContactMessages.getAll());
  };

  const handleMarkRead = (id) => {
    dbContactMessages.markRead(id);
    loadMessages();
  };

  const handleDelete = (id) => {
    dbContactMessages.delete(id);
    loadMessages();
    toast({ title: "Deleted", description: "Message deleted." });
  };

  const handleReply = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <>
      <Helmet><title>Messages - Admin</title></Helmet>
      <h1 className="text-2xl font-bold text-[#0A1F44] mb-6">Contact Messages</h1>
      
      <div className="grid gap-4">
        {messages.map(msg => (
          <div key={msg.id} className={`bg-white p-6 rounded-lg shadow border-l-4 ${msg.is_read ? 'border-gray-300' : 'border-[#C9A227]'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-[#0A1F44]">{msg.subject}</h3>
                <p className="text-sm text-gray-600">From: {msg.name} ({msg.email})</p>
                <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleReply(msg.email)}>
                  <Mail className="w-4 h-4 mr-2" /> Reply
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(msg.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-800 bg-gray-50 p-3 rounded mt-2">{msg.message}</p>
            {!msg.is_read && (
              <button 
                onClick={() => handleMarkRead(msg.id)}
                className="text-sm text-[#C9A227] hover:underline mt-2"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
        {messages.length === 0 && <p className="text-gray-500">No messages found.</p>}
      </div>
    </>
  );
};

export default ContactMessages;