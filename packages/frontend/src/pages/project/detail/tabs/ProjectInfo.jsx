import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const projectStatusMap = {
    planning: { label: '规划中', color: 'bg-blue-500' },
    in_progress: { label: '进行中', color: 'bg-yellow-500' },
    completed: { label: '已完成', color: 'bg-green-500' },
    suspended: { label: '已暂停', color: 'bg-gray-500' },
};

const ProjectInfo = ({ project }) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>项目概览</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium">项目名称</h3>
                            <p className="text-sm text-gray-500">{project.name}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">项目状态</h3>
                            <div className="flex items-center mt-1">
                                <Badge className={projectStatusMap[project.status]?.color || 'bg-gray-500'}>
                                    {projectStatusMap[project.status]?.label || project.status}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium">开始日期</h3>
                            <p className="text-sm text-gray-500">
                                {project.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : '未设置'}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium">创建者</h3>
                            <div className="flex items-center mt-1">
                                <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={project.creator.avatar} />
                                    <AvatarFallback>{project.creator.username[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{project.creator.username}</span>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <h3 className="font-medium">项目描述</h3>
                            <p className="text-sm text-gray-500">{project.description || '暂无描述'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>项目统计</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium">版本数量</h3>
                            <p className="text-2xl font-bold mt-2">{project.versions?.length || 0}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium">成员数量</h3>
                            <p className="text-2xl font-bold mt-2">{project.members?.length || 0}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium">创建时间</h3>
                            <p className="text-sm font-medium mt-2">
                                {format(new Date(project.createdAt), 'yyyy-MM-dd HH:mm')}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectInfo;
