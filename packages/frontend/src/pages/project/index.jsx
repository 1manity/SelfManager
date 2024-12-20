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
import { Card } from '@/components/ui/card';
import { IconDots } from '@tabler/icons-react';

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

    // 返回组件的逻辑部分（不包括 JSX）
    return (
        <div className="p-6">
            <div className="mb-6">
                <Button>新增项目</Button>
            </div>
            <div>
                <div className="flex flex-col border rounded-md divide-y">
                    {projects.map((project) => (
                        <div key={project.id} className="p-4 flex justify-between items-center w-full">
                            <div className="font-semibold text-sm w-1/6 truncate overflow-hidden whitespace-nowrap">
                                {project.name}
                            </div>
                            <div className="w-2/4 truncate overflow-hidden whitespace-nowrap text-gray-600 flex-1 text-sm font-medium">
                                {project.description}
                            </div>
                            <div className="w-1/4 flex justify-end">
                                <Button variant="ghost" className="w-6 h-8">
                                    <IconDots stroke={2}></IconDots>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
