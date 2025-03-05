import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const projectStatusMap = {
    planning: { label: '规划中', color: 'bg-blue-500' },
    in_progress: { label: '进行中', color: 'bg-yellow-500' },
    completed: { label: '已完成', color: 'bg-green-500' },
    suspended: { label: '已暂停', color: 'bg-gray-500' },
};

const RecentProjects = ({ projects }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>最近项目</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-accent"
                        onClick={() => navigate(`/project/detail/${project.id}`)}
                    >
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={project.creator.avatar} />
                            <AvatarFallback>{project.creator.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium leading-none">{project.name}</p>
                                <Badge className={projectStatusMap[project.status].color}>
                                    {projectStatusMap[project.status].label}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <span>开始时间：{format(new Date(project.startDate), 'yyyy-MM-dd')}</span>
                                <span className="mx-2">|</span>
                                <span>更新于：{format(new Date(project.updatedAt), 'yyyy-MM-dd')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default RecentProjects;
