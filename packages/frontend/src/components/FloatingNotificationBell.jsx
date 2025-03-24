import React, { useState, useEffect, useRef } from 'react';
import { IconBell } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/contexts/NotificationContext';
import { markAsRead, markAllAsRead, deleteNotification } from '@/api/notification';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const FloatingNotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, handleNotificationClick } =
        useNotification();
    const dropdownRef = useRef(null);

    // 点击外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = async (id) => {
        try {
            const response = await markAsRead(id);
            if (response.code === 200) {
                fetchUnreadCount();
                fetchNotifications();
            }
        } catch (error) {
            console.error('标记通知为已读失败:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await markAllAsRead();
            if (response.code === 200) {
                fetchUnreadCount();
                fetchNotifications();
            }
        } catch (error) {
            console.error('标记所有通知为已读失败:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteNotification(id);
            if (response.code === 200) {
                fetchNotifications();
                fetchUnreadCount();
            }
        } catch (error) {
            console.error('删除通知失败:', error);
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
            <Button
                variant="outline"
                size="icon"
                className="relative bg-white shadow-md hover:bg-gray-100"
                onClick={toggleDropdown}
            >
                <IconBell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden">
                    <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="font-medium">通知</h3>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                                全部标为已读
                            </Button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">暂无通知</div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 border-b hover:bg-gray-50 ${
                                        !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex justify-between">
                                        <div
                                            className="cursor-pointer flex-1"
                                            onClick={() => {
                                                handleNotificationClick(notification);
                                                handleMarkAsRead(notification.id);
                                                setIsOpen(false);
                                            }}
                                        >
                                            <p className="text-sm">{notification.content}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                    locale: zhCN,
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-start ml-2">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    已读
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-red-500"
                                                onClick={() => handleDelete(notification.id)}
                                            >
                                                删除
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingNotificationBell;
