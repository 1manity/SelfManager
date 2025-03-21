import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const severityColors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
};

const statusColors = {
    open: 'bg-red-500',
    in_progress: 'bg-blue-500',
    resolved: 'bg-green-500',
    closed: 'bg-gray-500',
};

const MyDefects = ({ defects, currentUserId }) => {
    const navigate = useNavigate();

    // 筛选出分配给当前用户的缺陷
    const myDefects = defects.filter((defect) => defect.assigneeId === currentUserId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>我的缺陷</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {myDefects.length > 0 ? (
                    myDefects.map((defect) => (
                        <div key={defect.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{defect.title}</h3>
                                <div className="flex items-center gap-2">
                                    <Badge className={statusColors[defect.status]}>
                                        {defect.status === 'open' && '待处理'}
                                        {defect.status === 'in_progress' && '处理中'}
                                        {defect.status === 'resolved' && '已解决'}
                                        {defect.status === 'closed' && '已关闭'}
                                    </Badge>
                                    <Badge className={severityColors[defect.severity]}>
                                        {defect.severity === 'low' && '低'}
                                        {defect.severity === 'medium' && '中'}
                                        {defect.severity === 'high' && '高'}
                                        {defect.severity === 'critical' && '严重'}
                                    </Badge>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">{defect.description}</p>
                            <div className="mt-3 text-xs text-gray-500">
                                <span>创建时间: {format(new Date(defect.createdAt), 'yyyy-MM-dd')}</span>
                                <span className="mx-2">|</span>
                                <span>指派时间: {format(new Date(defect.assignedAt), 'yyyy-MM-dd')}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500">暂无分配给您的缺陷</div>
                )}
            </CardContent>
        </Card>
    );
};

export default MyDefects;
