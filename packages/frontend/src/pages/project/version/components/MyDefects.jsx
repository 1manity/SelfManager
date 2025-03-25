import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const MyDefects = ({ defects = [], versionId, projectId, onDefectUpdated, loading = false }) => {
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

    if (!defects || defects.length === 0) {
        return <div className="text-center py-8 text-gray-500">暂无缺陷任务</div>;
    }

    const handleViewDefect = (defectId) => {
        navigate(`/project/${projectId}/version/${versionId}/defects?view=${defectId}`);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>缺陷标题</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>严重程度</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {defects.map((defect) => (
                    <TableRow key={defect.id}>
                        <TableCell>{defect.title}</TableCell>
                        <TableCell>{defect.status}</TableCell>
                        <TableCell>{defect.severity}</TableCell>
                        <TableCell>{format(new Date(defect.createdAt), 'yyyy-MM-dd')}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDefect(defect.id)}>
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

export default MyDefects;
