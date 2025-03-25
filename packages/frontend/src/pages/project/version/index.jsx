import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link, Routes, Route, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getVersionById } from '@/api/version';
import { getProjectById } from '@/api/project';
import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconInfoCircle, IconList, IconBug, IconSettings, IconUser } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';

const VersionDetail = () => {
    const { projectId, versionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const currentTab = currentPath.includes('/defects')
        ? 'defects'
        : currentPath.includes('/requirements')
          ? 'requirements'
          : currentPath.includes('/my-tasks')
            ? 'my-tasks'
            : currentPath.includes('/settings')
              ? 'settings'
              : 'info';

    const [version, setVersion] = useState(null);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toast } = useToast();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        fetchVersionAndProject();
    }, [versionId, projectId]);

    const fetchVersionAndProject = async () => {
        try {
            setLoading(true);
            const [versionResponse, projectResponse] = await Promise.all([
                getVersionById(versionId),
                getProjectById(projectId),
            ]);

            if (versionResponse.code === 200) {
                setVersion(versionResponse.data);
            } else {
                setError('获取版本信息失败');
            }

            if (projectResponse.code === 200) {
                setProject(projectResponse.data);
            } else {
                setError('获取项目信息失败');
            }
        } catch (error) {
            console.error('获取数据失败:', error);
            setError(error.message);
            toast({
                title: '获取数据失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVersionUpdate = (updatedVersion) => {
        setVersion(updatedVersion);
    };

    // 检查用户是否有管理权限
    const canManage = () => {
        if (!project || !user) return false;

        // 项目创建者或管理员有权限
        const userRole = project.members?.find((member) => member.id === user.id)?.ProjectUser?.role;
        return userRole === 'creator' || userRole === 'manager';
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">加载中...</div>;
    }

    if (error || !version || !project) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-500">{error || '加载失败'}</p>
                <Button variant="outline" onClick={() => navigate('/projects')} className="mt-4">
                    返回项目列表
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center p-6 border-b">
                <Button variant="ghost" onClick={() => navigate(`/project/detail/${projectId}/versions`)}>
                    <IconArrowLeft className="h-4 w-4 mr-2" />
                    返回项目
                </Button>
                <div className="ml-4">
                    <h1 className="text-xl font-bold">{version.versionNumber}</h1>
                    <p className="text-sm text-gray-500">{project.name}</p>
                </div>
            </div>

            <div className="border-b">
                <div className="flex space-x-2 px-6">
                    <Link
                        to={`/project/${projectId}/version/${versionId}`}
                        className={`px-4 py-2 font-medium ${
                            currentTab === 'info'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center">
                            <IconInfoCircle className="h-4 w-4 mr-2" />
                            版本概览
                        </div>
                    </Link>
                    <Link
                        to={`/project/${projectId}/version/${versionId}/requirements`}
                        className={`px-4 py-2 font-medium ${
                            currentTab === 'requirements'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center">
                            <IconList className="h-4 w-4 mr-2" />
                            需求管理
                        </div>
                    </Link>
                    <Link
                        to={`/project/${projectId}/version/${versionId}/defects`}
                        className={`px-4 py-2 font-medium ${
                            currentTab === 'defects'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center">
                            <IconBug className="h-4 w-4 mr-2" />
                            缺陷管理
                        </div>
                    </Link>
                    <Link
                        to={`/project/${projectId}/version/${versionId}/my-tasks`}
                        className={`px-4 py-2 font-medium ${
                            currentTab === 'my-tasks'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center">
                            <IconUser className="h-4 w-4 mr-2" />
                            我的任务
                        </div>
                    </Link>
                    {canManage() && (
                        <Link
                            to={`/project/${projectId}/version/${versionId}/settings`}
                            className={`px-4 py-2 font-medium ${
                                currentTab === 'settings'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center">
                                <IconSettings className="h-4 w-4 mr-2" />
                                版本设置
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Outlet context={{ version, project, canManage: canManage(), onVersionUpdate: handleVersionUpdate }} />
            </div>
        </div>
    );
};

export default VersionDetail;
