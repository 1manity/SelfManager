// src/pages/ProjectPage.js

import React, { useState, useEffect } from 'react';
import { getAllProjects, createProject, updateProject, deleteProject } from '@/api/project';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import { IconPlus, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useNavigate } from 'react-router-dom';

const ProjectPage = () => {
    const navigate = useNavigate();

    // 状态变量
    const [projects, setProjects] = useState([]); // 存储所有项目
    const [loading, setLoading] = useState(false); // 加载状态
    const [error, setError] = useState(null); // 错误信息

    // 创建项目时的表单状态
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        startDate: new Date().toISOString(), // 设置默认开始日期为当前时间
        status: 'planning',
        userIds: [], // 参与项目的用户ID数组
    });

    // 更新项目时的表单状态
    const [updateProjectData, setUpdateProjectData] = useState({
        projectId: null,
        updates: {},
    });

    // 添加新的状态
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    // 添加删除确认对话框的状态
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // useEffect 用于在组件挂载时获取所有项目数据
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true); // 开始加载
            try {
                const response = await getAllProjects();
                console.log(response);
                if (response.code === 200) {
                    setProjects(response.data); // 设置项目数据
                } else {
                    setError(response.message); // 设置错误信息
                }
            } catch (err) {
                setError(err.message); // 捕获异常并设置错误信息
            } finally {
                setLoading(false); // 结束加载
            }
        };

        fetchProjects(); // 调用获取项目数据的函数
    }, []);

    /**
     * 创建新项目
     * @param {Object} projectData - 项目数据
     */
    const handleCreateProject = async (projectData) => {
        try {
            const response = await createProject(projectData);
            if (response.code === 200) {
                setProjects([...projects, response.data]); // 将新项目添加到项目列表中
                // 清空表单时保持 startDate 为当前时间
                setNewProject({
                    name: '',
                    description: '',
                    startDate: new Date().toISOString(),
                    status: 'planning',
                    userIds: [],
                });
            } else {
                setError(response.message); // 设置错误信息
            }
        } catch (err) {
            setError(err.message); // 捕获异常并设置错误信息
        }
    };

    /**
     * 更新项目
     * @param {number} projectId - 项目ID
     * @param {Object} updates - 更新的数据
     */
    const handleUpdateProject = async (projectId, updates) => {
        try {
            const response = await updateProject(projectId, updates);
            if (response.code === 200) {
                // 更新项目列表中的对应项目
                setProjects(projects.map((project) => (project.id === projectId ? response.data : project)));
                // 清空更新表单
                setUpdateProjectData({
                    projectId: null,
                    updates: {},
                });
            } else {
                setError(response.message); // 设置错误信息
            }
        } catch (err) {
            setError(err.message); // 捕获异常并设置错误信息
        }
    };

    /**
     * 删除项目
     * @param {number} projectId - 项目ID
     */
    const handleDeleteProject = async (projectId) => {
        try {
            const response = await deleteProject(projectId);
            if (response.code === 200) {
                // 从项目列表中移除删除的项目
                setProjects(projects.filter((project) => project.id !== projectId));
            } else {
                setError(response.message); // 设置错误信息
            }
        } catch (err) {
            setError(err.message); // 捕获异常并设置错误信息
        }
    };

    // Add a new state for the create project dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // 修改处理删除的函数
    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (projectToDelete) {
            await handleDeleteProject(projectToDelete.id);
            setIsDeleteAlertOpen(false);
            setProjectToDelete(null);
        }
    };

    // 修改编辑对话框的处理函数
    const handleEditProject = (project) => {
        setCurrentProject(project);
        setIsEditDialogOpen(true);
    };

    // 添加编辑对话框关闭的处理函数
    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false);
        setCurrentProject(null);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        if (currentProject) {
            handleUpdateProject(currentProject.id, {
                name: currentProject.name,
                description: currentProject.description,
            });
            setIsEditDialogOpen(false);
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value) => {
        setNewProject((prev) => ({ ...prev, status: value }));
    };

    const handleSubmitNewProject = (e) => {
        e.preventDefault();
        handleCreateProject(newProject);
        setIsCreateDialogOpen(false);
    };

    // 添加跳转到详情页的处理函数
    const handleProjectClick = (projectId) => {
        navigate(`/project/detail/${projectId}`);
    };

    return (
        <div className="px-12 pt-8 bg-neutral-50 min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">项目</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <IconPlus className="h-4 w-4 mr-2" /> 新建项目
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>新建项目</DialogTitle>
                            <DialogDescription>在这里创建一个新的项目。填写项目的基本信息。</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitNewProject} className="space-y-4">
                            <div>
                                <Label htmlFor="name">项目名称</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={newProject.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">项目描述</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={newProject.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Button type="submit">创建项目</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-primary">项目加载中...</div>
                </div>
            ) : error ? (
                <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="cursor-pointer hover:shadow-md transition-shadow border border-neutral-200 overflow-hidden"
                            onClick={(e) => {
                                // 检查是否点击了下拉菜单内容
                                const isDropdownClick = e.target.closest('[role="menuitem"]');
                                // 检查是否点击了触发器
                                const isTriggerClick = e.target.closest('[data-state]');

                                if (!isDropdownClick && !isTriggerClick) {
                                    handleProjectClick(project.id);
                                }
                            }}
                        >
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="space-y-1 flex items-center justify-between w-full mb-3">
                                    <div className="flex flex-col">
                                        <h2 className="font-semibold text-base truncate">{project.name}</h2>
                                        <div className="text-xs text-gray-500 truncate capitalize">
                                            {project.status === 'planning' ? '规划中' : project.status}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 project-actions">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <IconDots className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <div onClick={() => handleEditProject(project)}>
                                                    <DropdownMenuItem>
                                                        <IconEdit className="mr-2 h-4 w-4" />
                                                        <span>修改项目</span>
                                                    </DropdownMenuItem>
                                                </div>

                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteClick(project)}
                                                >
                                                    <IconTrash className="mr-2 h-4 w-4" />
                                                    <span>删除项目</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className="flex items-start my-3">
                                    <div className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-full font-medium text-xs text-neutral-600">
                                        无关联仓库
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-[40px]">
                                    {project.description || '暂无描述'}
                                </p>
                                <div className="text-xs text-gray-400 mt-auto">
                                    {project.startDate && `上次修改: ${format(new Date(project.updatedAt), 'PP')}`}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* 修改编辑对话框 */}
            <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>修改项目</DialogTitle>
                        <DialogDescription>修改项目的名称和描述信息。</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">项目名称</Label>
                            <Input
                                id="edit-name"
                                name="name"
                                value={currentProject?.name || ''}
                                onChange={handleEditInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">项目描述</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                value={currentProject?.description || ''}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <Button type="submit">保存修改</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 添加删除确认对话框 */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除项目 "{projectToDelete?.name}" 吗？此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setProjectToDelete(null)}>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>确认删除</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectPage;
