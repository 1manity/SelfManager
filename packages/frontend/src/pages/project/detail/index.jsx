import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, addProjectMember, removeProjectMember, updateMemberRole } from '@/api/project';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconArrowLeft, IconUsers, IconPlus, IconInfoCircle, IconSettings, IconGitBranch } from '@tabler/icons-react';
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
import ProjectSettings from '../ProjectSettings/index.jsx';
import { updateProject, deleteProject } from '@/api/project';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('info'); // 'info', 'versions', 'members', 'settings'

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

    // 获取可添加的用户列表
    useEffect(() => {
        if (isAddMemberOpen && canManageMembers) {
            const fetchAvailableUsers = async () => {
                try {
                    const response = await getAllUsers();
                    if (response.code === 200) {
                        // 过滤掉已经在项目中的用户
                        const existingUserIds = project.members.map((m) => m.id);
                        setAvailableUsers(response.data.filter((user) => !existingUserIds.includes(user.id)));
                    }
                } catch (error) {
                    console.error('获取用户列表失败:', error);
                }
            };
            fetchAvailableUsers();
        }
    }, [isAddMemberOpen, project, canManageMembers]);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const response = await getProjectById(id);
                if (response.code === 200) {
                    setProject(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id]);

    const handleCreateVersion = async (e) => {
        e.preventDefault();
        try {
            const versionData = {
                ...newVersion,
                projectId: parseInt(id), // 确保 projectId 是数字类型
            };

            const response = await createVersion(versionData);
            if (response.code === 200) {
                toast({ title: '版本创建成功😃' });
                // 更新项目数据中的版本列表
                setProject({
                    ...project,
                    versions: [...project.versions, response.data],
                });
                // 重置表单
                setNewVersion({
                    versionNumber: '',
                    description: '',
                    releaseDate: '',
                    status: 'planned',
                });
                setIsAddVersionOpen(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            toast({ title: '版本创建失败😢', description: error.message });
            console.error('版本创建失败:', error);
        }
    };

    const handleBack = () => {
        navigate('/projects'); // 直接导航到项目列表页面
    };

    const handleAddMember = async () => {
        if (!selectedUserId || !selectedRole) return;

        try {
            const response = await addProjectMember(project.id, selectedUserId, selectedRole);
            if (response.code === 200) {
                // 更新项目成员列表
                const newMember = availableUsers.find((u) => u.id === selectedUserId);
                setProject({
                    ...project,
                    members: [...project.members, { ...newMember, ProjectUser: { role: selectedRole } }],
                });
                setIsAddMemberOpen(false);
                setSelectedUserId(null);
                setSelectedRole('member');
            } else {
                console.error('添加成员失败:', response.message);
            }
        } catch (error) {
            console.error('添加成员失败:', error);
        }
    };

    const handleRemoveMember = async () => {
        if (!removingUserId) return;

        try {
            const response = await removeProjectMember(project.id, removingUserId);
            if (response.code === 200) {
                setProject({
                    ...project,
                    members: project.members.filter((m) => m.id !== removingUserId),
                });
            } else {
                console.error('移除成员失败:', response.message);
            }
        } catch (error) {
            console.error('移除成员失败:', error);
        } finally {
            setIsRemoveMemberOpen(false);
            setRemovingUserId(null);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await updateMemberRole(project.id, userId, newRole);
            if (response.code === 200) {
                setProject({
                    ...project,
                    members: project.members.map((m) =>
                        m.id === userId ? { ...m, ProjectUser: { ...m.ProjectUser, role: newRole } } : m
                    ),
                });
            } else {
                console.error('更新角色失败:', response.message);
            }
        } catch (error) {
            console.error('更新角色失败:', error);
        }
    };

    // 添加项目设置相关的处理函数
    const handleUpdateProject = async (updates) => {
        try {
            const response = await updateProject(project.id, updates);
            if (response.code === 200) {
                setProject(response.data);
                toast({
                    title: '项目更新成功',
                });
            }
        } catch (error) {
            toast({
                title: '项目更新失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleDeleteProject = async () => {
        try {
            const response = await deleteProject(project.id);
            if (response.code === 200) {
                toast({
                    title: '项目删除成功',
                });
                navigate('/project');
            }
        } catch (error) {
            toast({
                title: '项目删除失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    // 修改菜单项，根据权限显示不同选项
    const menuItems = useMemo(() => {
        const items = [
            { id: 'info', icon: IconInfoCircle, label: '项目信息' },
            { id: 'versions', icon: IconGitBranch, label: '版本管理' },
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

    if (loading) return <div className="p-8">加载中...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!project) return <div className="p-8">项目不存在</div>;

    return (
        <div className="flex h-screen">
            {/* 左侧导航栏 */}
            <div className="w-64 p-6 border-r">
                <div className="flex items-center space-x-2 mb-8">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <IconArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">{project?.name}</h1>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={cn(
                                'w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                activeSection === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* 右侧内容区 */}
            <div className="flex-1 bg-[#fafafa] p-6 overflow-auto">
                {activeSection === 'info' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>项目概览</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium mb-2">基本信息</h3>
                                        <div className="space-y-2 text-sm text-gray-500">
                                            <p>状态：{project?.status}</p>
                                            <p>创建时间：{format(new Date(project?.createdAt), 'yyyy-MM-dd')}</p>
                                            <p>最后更新：{format(new Date(project?.updatedAt), 'yyyy-MM-dd')}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2">项目成员</h3>
                                        <div className="space-y-2 text-sm text-gray-500">
                                            <p>创建者：{project?.creator.username}</p>
                                            <p>成员数：{project?.members.length} 人</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">项目描述</h3>
                                    <p className="text-sm text-gray-600">{project?.description || '暂无项目描述'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeSection === 'versions' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">版本列表</h2>
                            <Button onClick={() => setIsAddVersionOpen(true)}>
                                <IconPlus className="h-4 w-4 mr-2" />
                                新建版本
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {project?.versions.map((version) => (
                                <Card
                                    key={version.id}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/project/${project.id}/version/${version.id}`)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium">{version.versionNumber}</h3>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                                                        {version.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{version.description}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                计划发布：{format(new Date(version.releaseDate), 'yyyy-MM-dd')}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'members' && canManageMembers && (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>项目成员</CardTitle>
                                {canManageMembers && (
                                    <Button onClick={() => setIsAddMemberOpen(true)}>
                                        <IconPlus className="h-4 w-4 mr-2" />
                                        添加成员
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* 创建者 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={project?.creator.avatar}
                                            alt={project?.creator.username}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="font-medium">{project?.creator.username}</div>
                                            <div className="text-sm text-gray-500">
                                                {project?.creator.nickname || project?.creator.username}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-primary">创建者</div>
                                </div>

                                {/* 其他成员 */}
                                {project?.members.map(
                                    (member) =>
                                        member.id !== project.creator.id && (
                                            <div key={member.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={member.avatar}
                                                        alt={member.username}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{member.username}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {member.nickname || member.username}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {canManageMembers && (
                                                        <>
                                                            <Select
                                                                value={member.ProjectUser.role}
                                                                onValueChange={(value) =>
                                                                    handleRoleChange(member.id, value)
                                                                }
                                                            >
                                                                <SelectTrigger className="w-[120px]">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="manager">管理者</SelectItem>
                                                                    <SelectItem value="member">成员</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setRemovingUserId(member.id);
                                                                    setIsRemoveMemberOpen(true);
                                                                }}
                                                            >
                                                                移除
                                                            </Button>
                                                        </>
                                                    )}
                                                    {!canManageMembers && (
                                                        <div className="text-sm text-gray-500">
                                                            {member.ProjectUser.role === 'manager' ? '管理者' : '成员'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeSection === 'settings' && canManageMembers && (
                    <ProjectSettings project={project} onUpdate={handleUpdateProject} onDelete={handleDeleteProject} />
                )}
            </div>

            {/* 添加版本对话框 */}
            <Dialog open={isAddVersionOpen} onOpenChange={setIsAddVersionOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>新建版本</DialogTitle>
                        <DialogDescription>创建一个新的项目版本。</DialogDescription>
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
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">描述</Label>
                            <Textarea
                                id="description"
                                value={newVersion.description}
                                onChange={(e) => setNewVersion({ ...newVersion, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="releaseDate">发布日期</Label>
                            <Input
                                id="releaseDate"
                                type="date"
                                value={newVersion.releaseDate}
                                onChange={(e) => setNewVersion({ ...newVersion, releaseDate: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit">创建版本</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 添加成员对话框 */}
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>添加项目成员</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label>选择用户</label>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="选择用户" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label>选择角色</label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manager">管理者</SelectItem>
                                    <SelectItem value="member">成员</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                            取消
                        </Button>
                        <Button onClick={handleAddMember}>添加</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 移除成员确认对话框 */}
            <AlertDialog open={isRemoveMemberOpen} onOpenChange={setIsRemoveMemberOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认移除</AlertDialogTitle>
                        <AlertDialogDescription>确定要移除该成员吗？此操作无法撤销。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveMember}>确认移除</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectDetail;
