import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, getProjectUsers } from '@/api/project';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconArrowLeft, IconUsers, IconCalendar, IconSettings } from '@tabler/icons-react';
import { format } from 'date-fns';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [projectUsers, setProjectUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const [projectResponse, usersResponse] = await Promise.all([getProjectById(id), getProjectUsers(id)]);

                if (projectResponse.code === 200) {
                    setProject(projectResponse.data);
                } else {
                    setError(projectResponse.message);
                }

                if (usersResponse.code === 200) {
                    setProjectUsers(usersResponse.data?.users);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id]);

    if (loading) return <div className="p-8">加载中...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!project) return <div className="p-8">项目不存在</div>;

    return (
        <div className="p-8 bg-neutral-100 min-h-screen">
            {/* 顶部导航 */}
            <div className="mb-6 flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <IconArrowLeft className="h-4 w-4 mr-2" />
                    返回
                </Button>
                <h1 className="text-2xl font-semibold">{project.name}</h1>
            </div>

            {/* 项目信息卡片 */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm text-gray-500">状态</div>
                            <div className="mt-1 font-medium">{project.status}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">创建时间</div>
                            <div className="mt-1 font-medium">{format(new Date(project.createdAt), 'yyyy-MM-dd')}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">项目成员</div>
                            <div className="mt-1 font-medium">{projectUsers.length} 人</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 标签页 */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    <TabsTrigger value="tasks">任务</TabsTrigger>
                    <TabsTrigger value="members">成员</TabsTrigger>
                    <TabsTrigger value="settings">设置</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle>项目描述</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{project.description || '暂无项目描述'}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks">
                    <Card>
                        <CardHeader>
                            <CardTitle>项目任务</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">暂无任务</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="members">
                    <Card>
                        <CardHeader>
                            <CardTitle>项目成员</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {projectUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">{user.role || '成员'}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>项目设置</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">项目设置功能开发中</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProjectDetail;
