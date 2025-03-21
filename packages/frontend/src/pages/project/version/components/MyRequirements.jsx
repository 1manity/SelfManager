import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const priorityColors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
};

const statusColors = {
    pending: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    developed: 'bg-yellow-500',
    testing: 'bg-purple-500',
    completed: 'bg-green-500',
};

const MyRequirements = ({ requirements, currentUserId }) => {
    const navigate = useNavigate();

    // 筛选出分配给当前用户的需求
    const myRequirements = requirements.filter((req) => req.assigneeId === currentUserId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>我的需求</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {myRequirements.length > 0 ? (
                    myRequirements.map((requirement) => (
                        <div key={requirement.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{requirement.title}</h3>
                                <div className="flex items-center gap-2">
                                    <Badge className={statusColors[requirement.status]}>
                                        {requirement.status === 'pending' && '待开发'}
                                        {requirement.status === 'in_progress' && '开发中'}
                                        {requirement.status === 'developed' && '已完成'}
                                        {requirement.status === 'testing' && '测试中'}
                                        {requirement.status === 'completed' && '已上线'}
                                    </Badge>
                                    <Badge className={priorityColors[requirement.priority]}>
                                        {requirement.priority === 'low' && '低优先级'}
                                        {requirement.priority === 'medium' && '中优先级'}
                                        {requirement.priority === 'high' && '高优先级'}
                                    </Badge>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">{requirement.description}</p>
                            <div className="mt-3">
                                <div className="text-sm text-gray-500 mb-1">进度: {requirement.progress}%</div>
                                <Progress value={requirement.progress} />
                            </div>
                            <div className="mt-3 text-xs text-gray-500">
                                <span>截止时间: {format(new Date(requirement.dueDate), 'yyyy-MM-dd')}</span>
                                <span className="mx-2">|</span>
                                <span>指派时间: {format(new Date(requirement.assignedAt), 'yyyy-MM-dd')}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500">暂无分配给您的需求</div>
                )}
            </CardContent>
        </Card>
    );
};

export default MyRequirements;
