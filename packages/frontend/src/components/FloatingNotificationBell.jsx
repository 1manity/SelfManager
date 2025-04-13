import React, { useState, useEffect, useRef } from 'react';
import { IconBell, IconCheck, IconTrash, IconBellRinging, IconBellOff, IconMessage } from '@tabler/icons-react';
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

    // 获取通知图标类型
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'alert':
                return <IconBellRinging className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />;
            case 'info':
                return <IconMessage className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />;
            default:
                return <IconBell className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
            <Button
                variant="outline"
                size="icon"
                className={`relative bg-white shadow-md hover:bg-gray-100 transition-all duration-300 ${unreadCount > 0 ? 'ring-2 ring-blue-300' : ''}`}
                onClick={toggleDropdown}
            >
                {unreadCount > 0 ? (
                    <IconBellRinging className="h-5 w-5 text-blue-500 animate-pulse" />
                ) : (
                    <IconBell className="h-5 w-5" />
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center shadow-md">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 animate-in fade-in">
                    <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                            <IconBell className="h-4 w-4 mr-2" />
                            通知中心
                            {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                    {unreadCount} 未读
                                </span>
                            )}
                        </h3>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 flex items-center"
                            >
                                <IconCheck className="h-4 w-4 mr-1" />
                                全部已读
                            </Button>
                        )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                <IconBellOff className="h-12 w-12 text-gray-300 mb-2" />
                                <p>暂无通知</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b hover:bg-gray-50 transition-colors duration-150 ${
                                        !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex justify-between">
                                        <div
                                            className="cursor-pointer flex-1 flex"
                                            onClick={() => {
                                                handleNotificationClick(notification);
                                                handleMarkAsRead(notification.id);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {getNotificationIcon(notification.type)}
                                            <div>
                                                <p className={`text-sm ${!notification.isRead ? 'font-semibold' : ''}`}>
                                                    {notification.content}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                                        addSuffix: true,
                                                        locale: zhCN,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start ml-2 space-x-1">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <IconCheck className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(notification.id)}
                                            >
                                                <IconTrash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="p-2 border-t bg-gray-50 text-center">
                            <Button variant="ghost" size="sm" className="text-gray-500 text-xs w-full">
                                查看全部通知
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FloatingNotificationBell;
