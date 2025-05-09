"use client"

import { Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import axios from "axios"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

// Add this after the imports
const style = document.createElement("style")
style.textContent = `
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .fade-in-right {
    animation: fadeInRight 0.3s ease-out;
  }
  
  .fade-in-left {
    animation: fadeInLeft 0.3s ease-out;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
document.head.appendChild(style)

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
    const connectSocketIO = () => {
      const socket = io(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"}`, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket"],
        query: user
          ? {
              userId: user.id,
              userName: user.username,
              userRole: user.role,
            }
          : {}, // Empty query if user is not logged in
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
      alert("Please log in to send messages.")
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()

    if (!input.trim() || !isConnected) return
    // if (!user) {
    //   alert("Please log in to send messages.")
    //   return
    // }

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
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pub/message?n=${n}`)
      if (response.data && response.data.length > 0) {
        console.log("Fetched messages:", response.data)
        console.log("Current messages:", messages)
        const newMessages = response.data
          .filter((msg) => {
            const existingMsgIds = messages.map((existingMsg) => Math.floor(existingMsg.id / 1000))
            const msgId = Math.floor(new Date(msg.createdAt).getTime() / 1000)
            return !existingMsgIds.includes(msgId)
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
          }))
        newMessages.reverse()
        console.log("New messages:", newMessages)
        setMessages((prev) => [...prev, ...newMessages])
        if (response.data.length < n) {
          setHasMoreMessages(false)
        }
      } else {
        setHasMoreMessages(false)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
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
    <div className="fixed bottom-5 right-5 z-[50000]">
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 w-96 h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200 transition-all duration-300 ease-in-out"
          onScroll={handleScroll}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 flex justify-between items-center h-14">
            <h3 className="text-lg font-medium mb-0 text-white flex items-center">
              <span
                className={`h-2.5 w-2.5 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-red-400"} animate-pulse`}
              ></span>
              Chatbox
            </h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 p-1.5 rounded-full hover:bg-blue-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-2 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => {
                  const isCurrentUser = user && message.sender?.id === user.id
                  return (
                    <div
                      key={message.id}
                      className={`animate-fadeIn transition-all duration-200 ease-in-out ${isCurrentUser ? "fade-in-right" : "fade-in-left"}`}
                    >
                      <div className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : ""}`}>
                          {!isCurrentUser && (
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-xs mr-2">{message.sender?.username || "Unknown"}</span>
                              <span
                                className={`text-xs text-white px-1.5 py-0.5 rounded-full ${getRoleBadgeColor(message.sender?.role)}`}
                              >
                                {message.sender?.role || "user"}
                              </span>
                            </div>
                          )}
                          <div
                            className={`inline-block px-3 py-2 rounded-2xl text-sm shadow-sm ${
                              isCurrentUser
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                : "bg-white border border-gray-100 text-gray-800"
                            }`}
                          >
                            {message.content}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center">
                            {isCurrentUser && <span className="mr-1">✓</span>}
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 bg-white">
            {!user && (
              <div className="text-xs text-center text-red-500 pt-2 pb-1 px-3 animate-fadeIn">
                You need to login to send messages
              </div>
            )}
            <form onSubmit={sendMessage} className="items-center gap-x-2 p-3 flex">
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                onClick={handleInputClick}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={!isConnected || !user}
              />
              <Button
                type="submit"
                disabled={!isConnected || !input.trim() || !user}
                className={`bg-blue-500 text-white rounded-full p-2.5 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  !isConnected || !input.trim() || !user ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:shadow-xl"
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
