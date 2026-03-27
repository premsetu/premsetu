import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../utils/socket";

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [draft, setDraft] = useState("");

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

  const handleSend = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;

    try {
      const messageText = draft;
      setDraft("");
      await api.post("/chat/send", { receiver: userId, message: messageText });
    } catch (error) {
      toast.error(error.response?.data?.message || "Message could not be sent.");
    }
  };

  return (
    <section className="page-shell">
      <div className="chat-shell">
        <div className="chat-header">
          <img
            src={otherUser?.profilePhoto || "https://placehold.co/100x100/F1FAEE/E63946?text=PS"}
            alt={otherUser?.fullName}
          />
          <div>
            <h2>{otherUser?.fullName || "Loading..."}</h2>
            <p>{otherUser?.profession || "Getting ready for a conversation"}</p>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((item) => (
            <div
              key={item._id}
              className={`message-bubble ${item.sender._id === user?._id ? "sent" : "received"}`}
            >
              {item.message}
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={handleSend}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a thoughtful message..." />
          <button className="primary-button">Send</button>
        </form>
      </div>
    </section>
  );
};

export default Chat;
