// src/pages/ProjectPage.js

import React, { useState, useEffect } from 'react';
import {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    addUserToProject,
    removeUserFromProject,
    getProjectUsers,
} from '@/api/project';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IconPlus, IconDots } from '@tabler/icons-react';
import { format } from 'date-fns';

const ProjectPage = () => {
    // 状态变量
    const [projects, setProjects] = useState([]); // 存储所有项目
    const [loading, setLoading] = useState(false); // 加载状态
    const [error, setError] = useState(null); // 错误信息

    // 创建项目时的表单状态
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'planning',
        userIds: [], // 参与项目的用户ID数组
    });

    // 更新项目时的表单状态
    const [updateProjectData, setUpdateProjectData] = useState({
        projectId: null,
        updates: {},
    });

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
                // 清空表单
                setNewProject({
                    name: '',
                    description: '',
                    startDate: '',
                    endDate: '',
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

    /**
     * 添加用户到项目
     * @param {number} projectId - 项目ID
     * @param {number} userId - 用户ID
     */
    const handleAddUserToProject = async (projectId, userId) => {
        try {
            const response = await addUserToProject(projectId, userId);
            if (response.code === 200) {
                // 可选：刷新项目用户列表或更新状态
            } else {
                setError(response.message); // 设置错误信息
            }
        } catch (err) {
            setError(err.message); // 捕获异常并设置错误信息
        }
    };

    /**
     * 从项目中移除用户
     * @param {number} projectId - 项目ID
     * @param {number} userId - 用户ID
     */
    const handleRemoveUserFromProject = async (projectId, userId) => {
        try {
            const response = await removeUserFromProject(projectId, userId);
            if (response.code === 200) {
                // 可选：刷新项目用户列表或更新状态
            } else {
                setError(response.message); // 设置错误信息
            }
        } catch (err) {
            setError(err.message); // 捕获异常并设置错误信息
        }
    };

    /**
     * 获取项目的所有用户
     * @param {number} projectId - 项目ID
     */
    const fetchProjectUsers = async (projectId) => {
        try {
            const response = await getProjectUsers(projectId);
            if (response.code === 200) {
                // 处理获取到的用户数据
                // 例如，将用户数据存储在状态中以便渲染
            } else {
                setError(response.message); // 设置错误信息
            }
        } catch (err) {
            setError(err.message); // 捕获异常并设置错误信息
        }
    };

    // Add a new state for the create project dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // ... (keep the existing useEffect and handler functions)

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
    return (
        <div className="px-12 pt-8 bg-neutral-100 h-screen">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="scroll-m-20 text-2xl font-thin tracking-tight mb-4">项目</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <IconPlus className="h-4 w-4" /> 新建项目
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>新建项目</DialogTitle>
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
                <div>项目加载中...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <Card key={project.id}>
                            <CardContent className="pl-6 pt-5 flex flex-col justify-between ">
                                <div className="space-y-1 flex items-center justify-between w-full">
                                    <div className="flex flex-col">
                                        <h2 className="font-semibold text-sm truncate">{project.name}</h2>
                                        <div className="text-xs text-gray-400 truncate">{project.status}</div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="icon">
                                            <IconDots></IconDots>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-start my-3">
                                    <div className="inline-flex items-center px-4 h-6 bg-gray-200 rounded-full font-medium text-sm">
                                        无关联仓库
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 truncate">{project.description}</p>
                                <div className="text-xs text-gray-400 truncate">
                                    {project.startDate && `上次修改: ${format(new Date(project.updatedAt), 'PP')}`}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectPage;
