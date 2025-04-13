import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link, Routes, Route, Outlet } from 'react-router-dom';
import { getProjectById, addProjectMember, removeProjectMember, updateMemberRole } from '@/api/project';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    IconArrowLeft,
    IconUsers,
    IconPlus,
    IconInfoCircle,
    IconSettings,
    IconGitBranch,
    IconFolder,
    IconCalendar,
    IconFileDescription,
    IconClockHour4,
    IconUserCircle,
    IconChevronRight,
    IconAlertCircle,
    IconEdit,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { createVersion } from '@/api/version';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers } from '@/api/user/admin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSelector } from 'react-redux';
import { updateProject, deleteProject } from '@/api/project';
import { Badge } from '@/components/ui/badge';

// 导入子页面组件
import ProjectInfo from './tabs/ProjectInfo';
import ProjectVersions from './tabs/ProjectVersions';
import ProjectMembers from './tabs/ProjectMembers';
import ProjectSettings from './tabs/ProjectSettings';
import ProjectFiles from './tabs/ProjectFiles';

// 项目状态映射
const projectStatusMap = {
    planning: { label: '规划中', color: 'bg-blue-100 text-blue-800' },
    in_progress: { label: '进行中', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
    suspended: { label: '已暂停', color: 'bg-gray-100 text-gray-800' },
};

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const currentTab = currentPath.includes('/files')
        ? 'files'
        : currentPath.includes('/members')
          ? 'members'
          : currentPath.includes('/versions')
            ? 'versions'
            : currentPath.includes('/settings')
              ? 'settings'
              : 'info';

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddVersionOpen, setIsAddVersionOpen] = useState(false);
    const [newVersion, setNewVersion] = useState({
        versionNumber: '',
        description: '',
        releaseDate: '',
        status: 'planned',
    });
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedRole, setSelectedRole] = useState('member');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [removingUserId, setRemovingUserId] = useState(null);
    const currentUser = useSelector((state) => state.user.user);

    const { toast } = useToast();

    // 检查用户权限
    const canManageMembers = useMemo(() => {
        if (!project || !currentUser) return false;
        return (
            currentUser.role === 'super_admin' ||
            currentUser.role === 'admin' ||
            project.creator.id === currentUser.id ||
            project.members.find((m) => m.id === currentUser.id)?.ProjectUser?.role === 'manager'
        );
    }, [project, currentUser]);

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const response = await getProjectById(id);
            if (response.code === 200) {
                setProject(response.data);
            } else {
                setError(response.message || '获取项目信息失败');
            }
        } catch (error) {
            console.error('获取项目信息失败:', error);
            setError(error.message || '获取项目信息失败');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const response = await getAllUsers();
            if (response.code === 200) {
                // 过滤掉已经是项目成员的用户
                const projectMemberIds = project.members.map((member) => member.id);
                const availableUsers = response.data.filter((user) => !projectMemberIds.includes(user.id));
                setAvailableUsers(availableUsers);
            }
        } catch (error) {
            console.error('获取可用用户失败:', error);
            toast({
                title: '获取可用用户失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleCreateVersion = async (e) => {
        e.preventDefault();
        try {
            const response = await createVersion({
                ...newVersion,
                projectId: id,
            });
            if (response.code === 200) {
                toast({
                    title: '版本创建成功',
                });
                setIsAddVersionOpen(false);
                // 重新获取项目数据以更新版本列表
                fetchProjectData();
                // 重置表单
                setNewVersion({
                    versionNumber: '',
                    description: '',
                    releaseDate: '',
                    status: 'planned',
                });
            }
        } catch (error) {
            console.error('创建版本失败:', error);
            toast({
                title: '创建版本失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleAddMember = async () => {
        if (!selectedUserId) {
            toast({
                title: '请选择用户',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await addProjectMember(id, selectedUserId, selectedRole);
            if (response.code === 200) {
                toast({
                    title: '成员添加成功',
                });
                setIsAddMemberOpen(false);
                // 重新获取项目数据以更新成员列表
                fetchProjectData();
            }
        } catch (error) {
            console.error('添加成员失败:', error);
            toast({
                title: '添加成员失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleRemoveMember = async () => {
        try {
            const response = await removeProjectMember(id, removingUserId);
            if (response.code === 200) {
                toast({
                    title: '成员移除成功',
                });
                setIsRemoveMemberOpen(false);
                // 重新获取项目数据以更新成员列表
                fetchProjectData();
            }
        } catch (error) {
            console.error('移除成员失败:', error);
            toast({
                title: '移除成员失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleUpdateProject = async (updatedProject) => {
        setProject(updatedProject);
    };

    const handleDeleteProject = () => {
        navigate('/projects');
    };

    // 修改菜单项，根据权限显示不同选项
    const menuItems = useMemo(() => {
        const items = [
            { id: 'info', icon: IconInfoCircle, label: '项目信息' },
            { id: 'versions', icon: IconGitBranch, label: '版本管理' },
            { id: 'files', icon: IconFolder, label: '文件管理' },
        ];

        // 只有管理员才能看到成员管理和项目设置
        if (canManageMembers) {
            items.push(
                { id: 'members', icon: IconUsers, label: '成员管理' },
                { id: 'settings', icon: IconSettings, label: '项目设置' }
            );
        }

        return items;
    }, [canManageMembers]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    if (error)
        return (
            <div className="p-8 text-red-500 flex items-center justify-center">
                <IconAlertCircle className="h-6 w-6 mr-2" />
                <span>{error}</span>
            </div>
        );
    if (!project)
        return (
            <div className="p-8 flex items-center justify-center">
                <IconAlertCircle className="h-6 w-6 mr-2" />
                <span>项目不存在</span>
            </div>
        );

    return (
        <div className="flex flex-col h-full">
            <div className="container mx-auto py-4 flex flex-col h-full">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/projects')}
                                className="hover:bg-gray-100"
                            >
                                <IconArrowLeft className="h-4 w-4 mr-1" />
                                返回
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center">
                                    {project.name}
                                    <Badge
                                        className={`ml-3 ${projectStatusMap[project.status]?.color || 'bg-gray-100'}`}
                                    >
                                        {projectStatusMap[project.status]?.label || project.status}
                                    </Badge>
                                </h1>
                                <div className="text-sm text-gray-500 flex flex-wrap gap-4 mt-1">
                                    <span className="flex items-center">
                                        <IconCalendar className="h-4 w-4 mr-1 text-gray-400" />
                                        创建于: {format(new Date(project.createdAt), 'yyyy-MM-dd')}
                                    </span>
                                    <span className="flex items-center">
                                        <IconUserCircle className="h-4 w-4 mr-1 text-gray-400" />
                                        创建者: {project.creator.username}
                                    </span>
                                    <span className="flex items-center">
                                        <IconClockHour4 className="h-4 w-4 mr-1 text-gray-400" />
                                        最近更新: {format(new Date(project.updatedAt), 'yyyy-MM-dd')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {canManageMembers && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center text-blue-600 border-blue-300 hover:bg-blue-50"
                                onClick={() => navigate(`/project/detail/${id}/settings`)}
                            >
                                <IconEdit className="h-4 w-4 mr-2" />
                                编辑项目
                            </Button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col">
                    <div className="flex overflow-x-auto border-b">
                        {menuItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.id === 'info' ? `/project/detail/${id}` : `/project/detail/${id}/${item.id}`}
                                className={`px-4 py-3 font-medium transition-colors flex-shrink-0 ${
                                    currentTab === item.id
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center">
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="p-6 overflow-auto flex-1 bg-gray-50/50">
                        {currentTab === 'info' && <ProjectInfo project={project} />}
                        {currentTab === 'versions' && (
                            <ProjectVersions project={project} onCreateVersion={() => setIsAddVersionOpen(true)} />
                        )}
                        {currentTab === 'members' && (
                            <ProjectMembers
                                project={project}
                                canManageMembers={canManageMembers}
                                onAddMember={() => {
                                    fetchAvailableUsers();
                                    setIsAddMemberOpen(true);
                                }}
                                onRemoveMember={(userId) => {
                                    setRemovingUserId(userId);
                                    setIsRemoveMemberOpen(true);
                                }}
                            />
                        )}
                        {currentTab === 'files' && <ProjectFiles project={project} />}
                        {currentTab === 'settings' && (
                            <ProjectSettings project={project} onProjectUpdate={handleUpdateProject} />
                        )}
                    </div>
                </div>
            </div>

            {/* 创建版本对话框 */}
            <Dialog open={isAddVersionOpen} onOpenChange={setIsAddVersionOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-xl">
                            <IconGitBranch className="h-5 w-5 mr-2 text-blue-500" />
                            创建新版本
                        </DialogTitle>
                        <DialogDescription>为项目 "{project.name}" 添加新的版本</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateVersion} className="space-y-4">
                        <div>
                            <Label htmlFor="versionNumber">版本号</Label>
                            <Input
                                id="versionNumber"
                                value={newVersion.versionNumber}
                                onChange={(e) => setNewVersion({ ...newVersion, versionNumber: e.target.value })}
                                placeholder="例如：v1.0.0"
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">描述</Label>
                            <Textarea
                                id="description"
                                value={newVersion.description}
                                onChange={(e) => setNewVersion({ ...newVersion, description: e.target.value })}
                                placeholder="版本描述..."
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="releaseDate">计划发布日期</Label>
                            <Input
                                id="releaseDate"
                                type="date"
                                value={newVersion.releaseDate}
                                onChange={(e) => setNewVersion({ ...newVersion, releaseDate: e.target.value })}
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">状态</Label>
                            <Select
                                value={newVersion.status}
                                onValueChange={(value) => setNewVersion({ ...newVersion, status: value })}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="选择状态" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planned">计划中</SelectItem>
                                    <SelectItem value="in_progress">进行中</SelectItem>
                                    <SelectItem value="released">已发布</SelectItem>
                                    <SelectItem value="deprecated">已废弃</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsAddVersionOpen(false)}>
                                取消
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                创建
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 添加成员对话框 */}
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-xl">
                            <IconUsers className="h-5 w-5 mr-2 text-blue-500" />
                            添加项目成员
                        </DialogTitle>
                        <DialogDescription>邀请用户加入 "{project.name}" 项目</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="user">选择用户</Label>
                            <Select onValueChange={(value) => setSelectedUserId(parseInt(value))}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="选择用户" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">选择角色</Label>
                            <Select defaultValue="member" onValueChange={setSelectedRole}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="选择角色" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">成员</SelectItem>
                                    <SelectItem value="manager">管理员</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                            取消
                        </Button>
                        <Button onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700">
                            添加
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 移除成员确认对话框 */}
            <AlertDialog open={isRemoveMemberOpen} onOpenChange={setIsRemoveMemberOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center">
                            <IconUsers className="h-5 w-5 mr-2 text-red-500" />
                            确认移除成员
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要移除该成员吗？此操作无法撤销，移除后该成员将无法访问此项目。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveMember} className="bg-red-600 hover:bg-red-700">
                            确认移除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectDetail;
