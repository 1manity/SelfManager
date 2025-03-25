import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const MyTasksList = ({ requirements = [], defects = [], versionId, projectId, onTaskUpdated, loading = false }) => {
    const navigate = useNavigate();

    // 合并需求和缺陷任务
    const allTasks = [
        ...(requirements || []).map((req) => ({ ...req, type: 'requirement' })),
        ...(defects || []).map((defect) => ({ ...defect, type: 'defect' })),
    ];

    if (loading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (!allTasks.length) {
        return <div className="text-center py-8 text-gray-500">暂无任务</div>;
    }

    const handleViewTask = (task) => {
        if (task.type === 'requirement') {
            // 导航到需求详情页
            navigate(`/project/${projectId}/version/${versionId}/requirements?view=${task.id}`);
        } else {
            // 导航到缺陷详情页
            navigate(`/project/${projectId}/version/${versionId}/defects?view=${task.id}`);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>任务类型</TableHead>
                    <TableHead>标题</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>优先级/严重度</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allTasks.map((task) => (
                    <TableRow key={`${task.type}-${task.id}`}>
                        <TableCell>
                            <Badge variant={task.type === 'requirement' ? 'default' : 'destructive'}>
                                {task.type === 'requirement' ? '需求' : '缺陷'}
                            </Badge>
                        </TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.type === 'requirement' ? task.priority : task.severity}</TableCell>
                        <TableCell>{format(new Date(task.createdAt), 'yyyy-MM-dd')}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewTask(task)}>
                                <IconEye className="h-4 w-4 mr-1" />
                                查看
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default MyTasksList;
