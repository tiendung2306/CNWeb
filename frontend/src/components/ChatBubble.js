"use client"

import { Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import axios from "axios"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const GroupChatBox = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [user, setUser] = useState(null)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const getOrCreateUser = () => {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        return null
      }
      return JSON.parse(storedUser)
    }

    const userData = getOrCreateUser()
    setUser(userData)
  }, [])

  // Connect to Socket.IO when component mounts
  useEffect(() => {
    if (!user) return

    const connectSocketIO = () => {
      const socket = io(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"}`, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket"],
        query: {
          userId: user.id,
          userName: user.username,
          userRole: user.role,
        },
      })

      socket.on("connect", () => {
        console.log("Socket.IO connected with ID:", socket.id)
        setIsConnected(true)
      })

      socket.on("chat message", (data) => {
        console.log("Received chat message:", data)
        data.id = Number(data.id)
        setMessages((prev) => [...prev, data])
      })

      socket.on("disconnect", () => {
        console.log("Socket.IO disconnected")
        setIsConnected(false)
      })

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error)
      })

      socketRef.current = socket
    }

    connectSocketIO()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user])

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleInputClick = () => {
    if (!user) {
      alert("Please log in to send messages.");
    }
  };

  const sendMessage = (e) => {
    e.preventDefault()

    if (!input.trim() || !isConnected || !user) return

    const newMessage = {
      id: Date.now(),
      content: input,
      sender: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, newMessage])

    socketRef.current.emit("chat message", newMessage)

    setInput("")
  }

  const fetchMessages = async (n) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pub/message?n=${n}`);
      if (response.data && response.data.length > 0) {
        console.log("Fetched messages:", response.data)
        console.log("Current messages:", messages)
        const newMessages = response.data
          .filter((msg) => {
            const existingMsgIds = messages.map((existingMsg) => Math.floor(existingMsg.id / 1000));
            const msgId = Math.floor(new Date(msg.createdAt).getTime() / 1000);
            return !existingMsgIds.includes(msgId);
          })
          .map((msg) => ({
            id: new Date(msg.createdAt).getTime(),
            content: msg.content,
            sender: {
              id: msg.user.id,
              username: msg.user.username,
              role: msg.user.role || "user", // Default role if not provided
              email: msg.user.email,
            },
            timestamp: new Date(msg.createdAt).getTime(),
          }));
        newMessages.reverse()
        console.log("New messages:", newMessages)
        setMessages((prev) => [...prev, ...newMessages]);
        if (response.data.length < n) {
          setHasMoreMessages(false);
        }
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchMessages(20)
    }
  }, [isOpen])

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && hasMoreMessages) {
      fetchMessages(messages.length + 20)
    }
  }

  // Function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "moderator":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
          onScroll={handleScroll}
        >
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center h-14">
            <h3 className="text-lg font-medium mb-0 text-white">Group Chat</h3>
            <div className="flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-red-400"}`}></span>
              <button onClick={toggleChat} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-gray-600 text-center">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="mb-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-sm mr-2">{message.sender?.username || "Unknown"}</span>
                        <span
                          className={`text-xs text-white px-2 py-0.5 rounded-full ${getRoleBadgeColor(message.sender?.role)}`}
                        >
                          {message.sender?.role || "user"}
                        </span>
                      </div>
                      <div
                        className={`inline-block px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="items-center gap-x-2 border-t border-gray-200 p-3 flex bg-white">
            <Input
              type="text"
              value={input}
              onChange={handleInputChange}
              onClick={handleInputClick}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected || !user}
            />
            <Button
              type="submit"
              disabled={!isConnected || !input.trim() || !user}
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
  )
}

export default GroupChatBox
