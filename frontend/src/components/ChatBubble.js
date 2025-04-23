"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid"; // Thêm import này
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [deviceId, setDeviceId] = useState(null);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const getOrCreateDeviceId = () => {
            let storedId = localStorage.getItem("deviceId");
            if (!storedId) {
                storedId = uuidv4();
                localStorage.setItem("deviceId", storedId);
            }
            return storedId;
        };

        const id = getOrCreateDeviceId();
        setDeviceId(id);

        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("chatMessages", JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "chatMessages" && e.newValue) {
                setMessages(JSON.parse(e.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Connect to Socket.IO when component mounts
    useEffect(() => {
        if (!deviceId) return;

        const connectSocketIO = () => {
            const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                transports: ['websocket'],
                query: { deviceId }
            });

            socket.on("connect", () => {
                console.log("Socket.IO connected with ID:", socket.id);
                setIsConnected(true);
            });

            socket.on("chat message", (data) => {
                console.log("Received message:", data);
                const newMessage = {
                    id: Date.now().toString(),
                    content: typeof data === 'object' ? data.content : data,
                    senderId: (typeof data === 'object' && data.senderId) || "admin",
                    timestamp: Date.now(),
                };

                setMessages((prev) => [...prev, newMessage]);
            });

            socket.on("disconnect", () => {
                console.log("Socket.IO disconnected");
                setIsConnected(false);
            });

            socket.on("connect_error", (error) => {
                console.error("Connection error:", error);
            });

            socketRef.current = socket;
        };

        connectSocketIO();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [deviceId]);

    // Scroll to bottom of messages when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const sendMessage = (e) => {
        e.preventDefault();

        if (!input.trim() || !isConnected || !deviceId) return;

        const newMessage = {
            id: Date.now().toString(),
            content: input,
            senderId: deviceId,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, newMessage]);

        socketRef.current.emit("chat message", {
            content: input,
            senderId: deviceId
        });

        setInput("");
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
                    <div className="bg-blue-500 text-white p-3 flex justify-between items-center h-14">
                        <h3 className="text-lg font-medium mb-0 text-white">Chat with store</h3>
                        <div className="flex items-center">
                            <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-red-400"}`}></span>
                            <button onClick={toggleChat} className="text-white text-xl hover:text-gray-200">
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                            <p className="text-gray-600">Start a conversation...</p>
                        ) : (
                            messages.map((message) => (
                                <div key={message.id} className={`mb-3 ${message.senderId === deviceId ? "text-right" : "text-left"}`}>
                                    <div
                                        className={`inline-block px-3 py-2 rounded-lg ${message.senderId === deviceId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                    <div className={`text-xs text-gray-500 mt-1 ${message.senderId === deviceId ? "text-right" : "text-left"}`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={sendMessage} className="border-t border-gray-200 p-3 flex">
                        <Input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Enter your message..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!isConnected}
                        />
                        <Button
                            type="submit"
                            disabled={!isConnected || !input.trim()}
                            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            )}

            <button
                onClick={toggleChat}
                className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                </svg>
            </button>
        </div>
    );
};

export default ChatBubble;
