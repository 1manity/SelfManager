import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initSocket, getSocket, closeSocket } from '@/services/socketService';
import { getUnreadCount, getNotifications } from '@/api/notification';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { toast } = useToast();
    const navigate = useNavigate();

    // 初始化 Socket 连接
    useEffect(() => {
        if (user) {
            const socket = initSocket();
            // 监听通知事件
            if (socket) {
                socket.on('notification', (notification) => {
                    console.log('收到通知:', notification);
                    // 更新未读数量
                    setUnreadCount((prev) => prev + 1);

                    // 显示通知
                    toast({
                        title: '新通知',
                        description: notification.message,
                        action: (
                            <button
                                onClick={() => handleNotificationClick(notification)}
                                className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                            >
                                查看
                            </button>
                        ),
                    });

                    // 更新通知列表
                    fetchNotifications();
                });
            }

            // 获取初始数据
            fetchUnreadCount();
            fetchNotifications();

            return () => {
                closeSocket();
            };
        }
    }, [isAuthenticated, user]);

    // 获取未读通知数量
    const fetchUnreadCount = async () => {
        try {
            const response = await getUnreadCount();
            if (response.code === 200) {
                setUnreadCount(response.data.count);
            }
        } catch (error) {
            console.error('获取未读通知数量失败:', error);
        }
    };

    // 获取通知列表
    const fetchNotifications = async (params = {}) => {
        try {
            setLoading(true);
            const response = await getNotifications(params);
            if (response.code === 200) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('获取通知列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 处理通知点击
    const handleNotificationClick = (notification) => {
        // 根据通知类型导航到相应页面
        if (notification.type === 'requirement_assigned') {
            // 从通知中获取项目ID和版本ID（如果有的话）
            const projectId = notification.projectId;
            const versionId = notification.versionId;
            const requirementId = notification.requirementId;

            if (projectId && versionId) {
                navigate(`/project/${projectId}/version/${versionId}`);
            } else if (requirementId) {
                // 如果没有项目和版本信息，可以先导航到需求列表页
                navigate(`/requirements`);
            }
        } else if (notification.type === 'defect_assigned') {
            // 从通知中获取项目ID和版本ID（如果有的话）
            const projectId = notification.projectId;
            const versionId = notification.versionId;
            const defectId = notification.defectId;

            if (projectId && versionId) {
                navigate(`/project/${projectId}/version/${versionId}`);
            } else if (defectId) {
                // 如果没有项目和版本信息，可以先导航到缺陷列表页
                navigate(`/defects`);
            }
        }
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        handleNotificationClick,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
