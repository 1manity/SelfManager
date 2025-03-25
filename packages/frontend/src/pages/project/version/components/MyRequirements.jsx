import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const MyRequirements = ({ requirements = [], versionId, projectId, onRequirementUpdated, loading = false }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (!requirements || requirements.length === 0) {
        return <div className="text-center py-8 text-gray-500">暂无需求任务</div>;
    }

    const handleViewRequirement = (requirementId) => {
        navigate(`/project/${projectId}/version/${versionId}/requirements?view=${requirementId}`);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>需求标题</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>优先级</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requirements.map((req) => (
                    <TableRow key={req.id}>
                        <TableCell>{req.title}</TableCell>
                        <TableCell>{req.status}</TableCell>
                        <TableCell>{req.priority}</TableCell>
                        <TableCell>{format(new Date(req.createdAt), 'yyyy-MM-dd')}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewRequirement(req.id)}>
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

export default MyRequirements;
