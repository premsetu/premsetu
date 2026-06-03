import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../utils/socket";

const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(timestamp));
};

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return undefined;
    }

    const handleIncomingMessage = (incomingMessage) => {
      const relatedToCurrentChat =
        incomingMessage.sender._id === userId || incomingMessage.receiver._id === userId;

      if (!relatedToCurrentChat) {
        return;
      }

      setMessages((currentMessages) => {
        if (currentMessages.some((message) => message._id === incomingMessage._id)) {
          return currentMessages;
        }

        return [...currentMessages, incomingMessage];
      });
    };

    socket.on("chat:new-message", handleIncomingMessage);

    return () => {
      socket.off("chat:new-message", handleIncomingMessage);
    };
  }, [userId]);

  useEffect(() => {
    const fetchConversation = async () => {
      const { data } = await api.get(`/chat/${userId}`);
      setMessages(data.messages || []);
      setOtherUser(data.otherUser);
    };

    fetchConversation().catch(() => {
      toast.error("You can only access chats with mutual matches.");
    });
  }, [userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    const messageText = draft.trim();
    if (!messageText || sending) return;

    try {
      setSending(true);
      setDraft("");
      await api.post("/chat/send", { receiver: userId, message: messageText });
    } catch (error) {
      setDraft(messageText);
      toast.error(error.response?.data?.message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="page-shell">
      <div className="chat-layout">
        <aside className="chat-side-panel">
          <div className="chat-avatar-frame">
            <img
              src={otherUser?.profilePhoto || "https://placehold.co/200x200/F0EDE6/3B4A3A?text=PS"}
              alt={otherUser?.fullName}
            />
          </div>

          <div>
            <span className="eyebrow">Matched conversation</span>
            <h3>{otherUser?.fullName || "Loading..."}</h3>
            <p className="muted-copy">{otherUser?.profession || "Getting ready for a conversation"}</p>
          </div>

          <div className="helper-ribbon">
            Tip: keep the first few messages warm, respectful, and simple. Clarity works better than overthinking.
          </div>
        </aside>

        <div className="chat-shell">
          <div className="chat-header">
            <div className="chat-avatar-frame">
              <img
                src={otherUser?.profilePhoto || "https://placehold.co/200x200/F0EDE6/3B4A3A?text=PS"}
                alt={otherUser?.fullName}
              />
            </div>
            <div>
              <h2>{otherUser?.fullName || "Loading..."}</h2>
              <p className="muted-copy">{otherUser?.profession || "Getting ready for a conversation"}</p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length ? (
              messages.map((item) => (
                <div
                  key={item._id}
                  className={`message-bubble ${item.sender._id === user?._id ? "sent" : "received"}`}
                >
                  <div>{item.message}</div>
                  <span className="message-meta">{formatMessageTime(item.timestamp)}</span>
                </div>
              ))
            ) : (
              <div className="chat-empty">
                No messages yet. Start with a warm hello and keep the tone natural and respectful.
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <form className="chat-form" onSubmit={handleSend}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a thoughtful message..."
              disabled={sending}
            />
            <button type="submit" className="primary-button" disabled={!draft.trim() || sending}>
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Chat;
