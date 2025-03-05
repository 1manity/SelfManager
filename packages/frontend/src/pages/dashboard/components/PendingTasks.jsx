import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const priorityColors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
};

const severityColors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
};

const PendingTasks = ({ tasks }) => {
    const navigate = useNavigate();

    const handleTaskClick = (versionId, projectId) => {
        navigate(`/project/${projectId}/version/${versionId}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>待处理任务</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="requirements">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="requirements">需求</TabsTrigger>
                        <TabsTrigger value="defects">缺陷</TabsTrigger>
                    </TabsList>
                    <TabsContent value="requirements" className="space-y-4 mt-4">
                        {tasks.requirements.map((requirement) => (
                            <div
                                key={requirement.id}
                                className="p-4 rounded-lg border cursor-pointer hover:bg-accent"
                                onClick={() => handleTaskClick(requirement.version.id, requirement.version.project.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{requirement.title}</h3>
                                    <Badge className={priorityColors[requirement.priority]}>
                                        {requirement.priority === 'low' && '低优先级'}
                                        {requirement.priority === 'medium' && '中优先级'}
                                        {requirement.priority === 'high' && '高优先级'}
                                    </Badge>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    <div>
                                        项目：{requirement.version.project.name} / {requirement.version.versionNumber}
                                    </div>
                                    <div className="mt-1">
                                        截止时间：{format(new Date(requirement.dueDate), 'yyyy-MM-dd')}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.requirements.length === 0 && (
                            <div className="text-center text-muted-foreground">暂无待处理需求</div>
                        )}
                    </TabsContent>
                    <TabsContent value="defects" className="space-y-4 mt-4">
                        {tasks.defects.map((defect) => (
                            <div
                                key={defect.id}
                                className="p-4 rounded-lg border cursor-pointer hover:bg-accent"
                                onClick={() => handleTaskClick(defect.version.id, defect.version.project.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{defect.title}</h3>
                                    <Badge className={severityColors[defect.severity]}>
                                        {defect.severity === 'low' && '低'}
                                        {defect.severity === 'medium' && '中'}
                                        {defect.severity === 'high' && '高'}
                                        {defect.severity === 'critical' && '严重'}
                                    </Badge>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    <div>
                                        项目：{defect.version.project.name} / {defect.version.versionNumber}
                                    </div>
                                    <div className="mt-1">
                                        创建时间：{format(new Date(defect.createdAt), 'yyyy-MM-dd')}
                                        {defect.assignedAt && (
                                            <>
                                                <span className="mx-2">|</span>
                                                指派时间：{format(new Date(defect.assignedAt), 'yyyy-MM-dd')}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.defects.length === 0 && (
                            <div className="text-center text-muted-foreground">暂无待处理缺陷</div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default PendingTasks;
