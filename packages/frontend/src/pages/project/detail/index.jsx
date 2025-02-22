import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById } from '@/api/project';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconArrowLeft, IconUsers, IconPlus, IconInfoCircle, IconSettings } from '@tabler/icons-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { createVersion } from '@/api/version';
import { useToast } from '@/hooks/use-toast';

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

    const { toast } = useToast();

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

    const menuItems = [
        { id: 'info', icon: IconInfoCircle, label: '项目信息' },
        { id: 'versions', icon: IconPlus, label: '版本管理' },
        { id: 'members', icon: IconUsers, label: '成员管理' },
        { id: 'settings', icon: IconSettings, label: '项目设置' },
    ];

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

                {activeSection === 'members' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>项目成员</CardTitle>
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
                                            <div className="text-sm text-gray-500">{project?.creator.username}</div>
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
                                                        <div className="text-sm text-gray-500">{member.username}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {member.ProjectUser.role === 'manager' ? '管理者' : '成员'}
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeSection === 'settings' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>项目设置</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">项目设置功能开发中</p>
                        </CardContent>
                    </Card>
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
        </div>
    );
};

export default ProjectDetail;
