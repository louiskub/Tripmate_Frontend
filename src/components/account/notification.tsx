"use client"

import { Bell } from "lucide-react"
import { useState, useRef, useEffect } from "react"

// Sample notification data - replace with your actual data source
const initialNotifications = [
  {
    id: 1,
    title: "New message received",
    description: "You have a new message from John Doe",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Update available",
    description: "A new software update is ready to install",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Task completed",
    description: "Your export has finished processing",
    time: "2 hours ago",
    unread: false,
  },
]

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => n.unread).length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-custom-black hover:text-dark-blue default-btn"
        aria-label="Notifications"
      >
        <Bell className="h-7 w-7" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red text-custom-white text-xs font-medium">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-md border border-light-gray bg-custom-white text-custom-black z-50"
          style={{ boxShadow: "var(--boxshadow-lifted)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-light-gray">
            <span className="font-semibold text-custom-black">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-gray hover:text-dark-blue transition-colors">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto custom-scroll-bar">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className="flex flex-col gap-1 p-3 border-b border-light-gray last:border-b-0 hover:bg-pale-blue cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none text-custom-black">{notification.title}</p>
                      <p className="text-sm text-gray mt-1">{notification.description}</p>
                    </div>
                    {notification.unread && <div className="h-2 w-2 rounded-full bg-dark-blue mt-1 flex-shrink-0" />}
                  </div>
                  <span className="text-xs text-gray">{notification.time}</span>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-light-gray">
            <button className="w-full py-3 text-sm text-center text-custom-black hover:bg-pale-blue transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
