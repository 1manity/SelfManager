import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVersionById } from '@/api/version';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    IconArrowLeft,
    IconPlus,
    IconInfoCircle,
    IconBug,
    IconListCheck,
    IconEdit,
    IconTrash,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createRequirement, getRequirementsByVersionId, updateRequirement, deleteRequirement } from '@/api/requirement';
import { createDefect, getDefectsByVersionId, updateDefect, deleteDefect } from '@/api/defect';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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

const VersionDetail = () => {
    const { projectId, versionId } = useParams();
    const navigate = useNavigate();
    const [version, setVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('info'); // 'info', 'requirements', 'bugs'
    const { toast } = useToast();
    const [requirements, setRequirements] = useState([]);
    const [bugs, setBugs] = useState([]);
    const [isAddRequirementOpen, setIsAddRequirementOpen] = useState(false);
    const [isAddBugOpen, setIsAddBugOpen] = useState(false);
    const [newRequirement, setNewRequirement] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
    });
    const [newBug, setNewBug] = useState({
        title: '',
        description: '',
        stepsToReproduce: '',
        severity: 'medium',
        status: 'open',
    });
    const [isEditRequirementOpen, setIsEditRequirementOpen] = useState(false);
    const [isEditDefectOpen, setIsEditDefectOpen] = useState(false);
    const [editingRequirement, setEditingRequirement] = useState(null);
    const [editingDefect, setEditingDefect] = useState(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(null); // 'requirement' or 'defect'

    useEffect(() => {
        const fetchVersionData = async () => {
            if (!versionId) return;

            setLoading(true);
            try {
                const response = await getVersionById(versionId);
                if (response.code === 200) {
                    setVersion(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVersionData();
    }, [versionId]);

    const fetchRequirementsAndBugs = async () => {
        try {
            const [reqResponse, defectResponse] = await Promise.all([
                getRequirementsByVersionId(versionId),
                getDefectsByVersionId(versionId),
            ]);

            if (reqResponse.code === 200) {
                setRequirements(reqResponse.data);
            }
            if (defectResponse.code === 200) {
                setBugs(defectResponse.data);
            }
        } catch (err) {
            console.error('获取需求和缺陷失败:', err);
        }
    };

    useEffect(() => {
        if (versionId) {
            fetchRequirementsAndBugs();
        }
    }, [versionId]);

    const handleCreateRequirement = async (e) => {
        e.preventDefault();
        try {
            const response = await createRequirement({
                ...newRequirement,
                versionId: parseInt(versionId),
            });

            if (response.code === 200) {
                toast({ title: '需求创建成功😃' });
                setRequirements([...requirements, response.data]);
                setIsAddRequirementOpen(false);
                setNewRequirement({
                    title: '',
                    description: '',
                    priority: 'medium',
                    status: 'pending',
                    dueDate: format(new Date(), 'yyyy-MM-dd'),
                });
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            toast({ title: '需求创建失败😢', description: error.message });
        }
    };

    const handleCreateBug = async (e) => {
        e.preventDefault();
        try {
            const response = await createDefect({
                ...newBug,
                versionId: parseInt(versionId),
            });

            if (response.code === 200) {
                toast({ title: '缺陷创建成功😃' });
                setBugs([...bugs, response.data]);
                setIsAddBugOpen(false);
                setNewBug({
                    title: '',
                    description: '',
                    stepsToReproduce: '',
                    severity: 'medium',
                    status: 'open',
                });
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            toast({ title: '缺陷创建失败😢', description: error.message });
        }
    };

    const handleEditRequirement = (requirement) => {
        setEditingRequirement({
            ...requirement,
            dueDate: format(new Date(requirement.dueDate), 'yyyy-MM-dd'),
        });
        setIsEditRequirementOpen(true);
    };

    const handleUpdateRequirement = async (e) => {
        e.preventDefault();
        try {
            const response = await updateRequirement(editingRequirement.id, editingRequirement);
            if (response.code === 200) {
                toast({ title: '需求更新成功😃' });
                setRequirements(requirements.map((req) => (req.id === response.data.id ? response.data : req)));
                setIsEditRequirementOpen(false);
                setEditingRequirement(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            toast({ title: '需求更新失败😢', description: error.message });
        }
    };

    const handleEditDefect = (defect) => {
        setEditingDefect(defect);
        setIsEditDefectOpen(true);
    };

    const handleUpdateDefect = async (e) => {
        e.preventDefault();
        try {
            const response = await updateDefect(editingDefect.id, editingDefect);
            if (response.code === 200) {
                toast({ title: '缺陷更新成功😃' });
                setBugs(bugs.map((bug) => (bug.id === response.data.id ? response.data : bug)));
                setIsEditDefectOpen(false);
                setEditingDefect(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            toast({ title: '缺陷更新失败😢', description: error.message });
        }
    };

    const handleDeleteClick = (item, type) => {
        setItemToDelete(item);
        setDeleteType(type);
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            let response;
            if (deleteType === 'requirement') {
                response = await deleteRequirement(itemToDelete.id);
                if (response.code === 200) {
                    setRequirements(requirements.filter((req) => req.id !== itemToDelete.id));
                    toast({ title: '需求删除成功😃' });
                }
            } else {
                response = await deleteDefect(itemToDelete.id);
                if (response.code === 200) {
                    setBugs(bugs.filter((bug) => bug.id !== itemToDelete.id));
                    toast({ title: '缺陷删除成功😃' });
                }
            }
            setIsDeleteAlertOpen(false);
            setItemToDelete(null);
            setDeleteType(null);
        } catch (error) {
            toast({ title: '删除失败😢', description: error.message });
        }
    };

    const menuItems = [
        { id: 'info', icon: IconInfoCircle, label: '版本信息' },
        { id: 'requirements', icon: IconListCheck, label: '需求列表' },
        { id: 'bugs', icon: IconBug, label: '缺陷列表' },
    ];

    if (loading) return <div className="p-8">加载中...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!version) return <div className="p-8">版本不存在</div>;

    const renderRequirementItem = (requirement) => (
        <div key={requirement.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg">
            <div>
                <h3 className="font-medium">{requirement.title}</h3>
                <p className="text-sm text-gray-500">{requirement.description}</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{requirement.priority}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{requirement.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditRequirement(requirement)}>
                        <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(requirement, 'requirement')}
                        className="text-red-500 hover:text-red-700"
                    >
                        <IconTrash className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderDefectItem = (defect) => (
        <div key={defect.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg">
            <div>
                <h3 className="font-medium">{defect.title}</h3>
                <p className="text-sm text-gray-500">{defect.description}</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{defect.severity}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{defect.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditDefect(defect)}>
                        <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(defect, 'defect')}
                        className="text-red-500 hover:text-red-700"
                    >
                        <IconTrash className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen">
            {/* 左侧导航栏 */}
            <div className="w-64 p-6 border-r">
                <div className="flex items-center space-x-2 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/project/detail/${projectId}`)}>
                        <IconArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">{version.versionNumber}</h1>
                        <p className="text-sm text-gray-500">版本详情</p>
                    </div>
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
                                <CardTitle>版本概览</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium mb-2">基本信息</h3>
                                        <div className="space-y-2 text-sm text-gray-500">
                                            <p>状态：{version.status}</p>
                                            <p>创建时间：{format(new Date(version.createdAt), 'yyyy-MM-dd')}</p>
                                            <p>计划发布：{format(new Date(version.releaseDate), 'yyyy-MM-dd')}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2">统计信息</h3>
                                        <div className="space-y-2 text-sm text-gray-500">
                                            <p>需求数量：{requirements.length}</p>
                                            <p>缺陷数量：{bugs.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">版本描述</h3>
                                    <p className="text-sm text-gray-600">{version.description || '暂无版本描述'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeSection === 'requirements' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">需求列表</h2>
                            <Button type="button" onClick={() => setIsAddRequirementOpen(true)}>
                                <IconPlus className="h-4 w-4 mr-2" />
                                添加需求
                            </Button>
                        </div>
                        <Card>
                            <CardContent className="p-6">
                                {requirements.length > 0 ? (
                                    <div className="space-y-4">{requirements.map(renderRequirementItem)}</div>
                                ) : (
                                    <div className="text-sm text-gray-500">暂无需求</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeSection === 'bugs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">缺陷列表</h2>
                            <Button type="button" onClick={() => setIsAddBugOpen(true)}>
                                <IconPlus className="h-4 w-4 mr-2" />
                                添加缺陷
                            </Button>
                        </div>
                        <Card>
                            <CardContent className="p-6">
                                {bugs.length > 0 ? (
                                    <div className="space-y-4">{bugs.map(renderDefectItem)}</div>
                                ) : (
                                    <div className="text-sm text-gray-500">暂无缺陷</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 添加需求对话框 */}
                <Dialog open={isAddRequirementOpen} onOpenChange={setIsAddRequirementOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>添加需求</DialogTitle>
                            <DialogDescription>创建新的需求项。</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateRequirement} className="space-y-4">
                            <div>
                                <Label htmlFor="title">标题</Label>
                                <Input
                                    id="title"
                                    value={newRequirement.title}
                                    onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">描述</Label>
                                <Textarea
                                    id="description"
                                    value={newRequirement.description}
                                    onChange={(e) =>
                                        setNewRequirement({ ...newRequirement, description: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="priority">优先级</Label>
                                <Select
                                    value={newRequirement.priority}
                                    onValueChange={(value) => setNewRequirement({ ...newRequirement, priority: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择优先级" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">低</SelectItem>
                                        <SelectItem value="medium">中</SelectItem>
                                        <SelectItem value="high">高</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="dueDate">截止日期</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={newRequirement.dueDate}
                                    onChange={(e) => setNewRequirement({ ...newRequirement, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit">创建需求</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* 添加缺陷对话框 */}
                <Dialog open={isAddBugOpen} onOpenChange={setIsAddBugOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>添加缺陷</DialogTitle>
                            <DialogDescription>创建新的缺陷项。</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateBug} className="space-y-4">
                            <div>
                                <Label htmlFor="bug-title">标题</Label>
                                <Input
                                    id="bug-title"
                                    value={newBug.title}
                                    onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="bug-description">描述</Label>
                                <Textarea
                                    id="bug-description"
                                    value={newBug.description}
                                    onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="stepsToReproduce">复现步骤</Label>
                                <Textarea
                                    id="stepsToReproduce"
                                    value={newBug.stepsToReproduce}
                                    onChange={(e) => setNewBug({ ...newBug, stepsToReproduce: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="bug-severity">严重程度</Label>
                                <Select
                                    value={newBug.severity}
                                    onValueChange={(value) => setNewBug({ ...newBug, severity: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择严重程度" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">低</SelectItem>
                                        <SelectItem value="medium">中</SelectItem>
                                        <SelectItem value="high">高</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">创建缺陷</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* 添加编辑需求对话框 */}
                <Dialog open={isEditRequirementOpen} onOpenChange={setIsEditRequirementOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>编辑需求</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateRequirement} className="space-y-4">
                            <div>
                                <Label htmlFor="title">标题</Label>
                                <Input
                                    id="title"
                                    value={editingRequirement?.title}
                                    onChange={(e) =>
                                        setEditingRequirement({ ...editingRequirement, title: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">描述</Label>
                                <Textarea
                                    id="description"
                                    value={editingRequirement?.description}
                                    onChange={(e) =>
                                        setEditingRequirement({ ...editingRequirement, description: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="priority">优先级</Label>
                                <Select
                                    value={editingRequirement?.priority}
                                    onValueChange={(value) =>
                                        setEditingRequirement({ ...editingRequirement, priority: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择优先级" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">低</SelectItem>
                                        <SelectItem value="medium">中</SelectItem>
                                        <SelectItem value="high">高</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="dueDate">截止日期</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={editingRequirement?.dueDate}
                                    onChange={(e) =>
                                        setEditingRequirement({ ...editingRequirement, dueDate: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <Button type="submit">更新需求</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* 添加编辑缺陷对话框 */}
                <Dialog open={isEditDefectOpen} onOpenChange={setIsEditDefectOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>编辑缺陷</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateDefect} className="space-y-4">
                            <div>
                                <Label htmlFor="title">标题</Label>
                                <Input
                                    id="title"
                                    value={editingDefect?.title}
                                    onChange={(e) => setEditingDefect({ ...editingDefect, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">描述</Label>
                                <Textarea
                                    id="description"
                                    value={editingDefect?.description}
                                    onChange={(e) =>
                                        setEditingDefect({ ...editingDefect, description: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="stepsToReproduce">复现步骤</Label>
                                <Textarea
                                    id="stepsToReproduce"
                                    value={editingDefect?.stepsToReproduce}
                                    onChange={(e) =>
                                        setEditingDefect({ ...editingDefect, stepsToReproduce: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="severity">严重程度</Label>
                                <Select
                                    value={editingDefect?.severity}
                                    onValueChange={(value) => setEditingDefect({ ...editingDefect, severity: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择严重程度" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">低</SelectItem>
                                        <SelectItem value="medium">中</SelectItem>
                                        <SelectItem value="high">高</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">更新缺陷</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* 添加删除确认对话框 */}
                <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                                确定要删除{deleteType === 'requirement' ? '需求' : '缺陷'} "{itemToDelete?.title}"
                                吗？此操作无法撤销。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => {
                                    setItemToDelete(null);
                                    setDeleteType(null);
                                }}
                            >
                                取消
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete}>确认删除</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default VersionDetail;
