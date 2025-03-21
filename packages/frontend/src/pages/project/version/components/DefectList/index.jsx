import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import DefectItem from './DefectItem';
import CreateDefect from './CreateDefect';
import EditDefect from './EditDefect';
import { getProjectUsers } from '@/api/project';
import { assignDefect } from '@/api/defect';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

const DefectList = ({ defects, onStatusChange, onDelete, onCreate, onUpdate, versionId, projectId }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingDefect, setEditingDefect] = useState(null);
    const [deletingDefect, setDeletingDefect] = useState(null);
    const [members, setMembers] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchProjectMembers();
    }, [projectId]);

    const fetchProjectMembers = async () => {
        try {
            const response = await getProjectUsers(projectId);
            if (response.code === 200) {
                setMembers(response.data.members);
            }
        } catch (error) {
            console.error('获取项目成员失败:', error);
        }
    };

    const handleAssign = async (defectId, assigneeId) => {
        try {
            if (!defectId) {
                console.error('缺陷ID不能为空');
                toast({
                    title: '指派失败',
                    description: '缺陷ID不能为空',
                    variant: 'destructive',
                });
                return;
            }

            const response = await assignDefect(defectId, assigneeId === null ? null : assigneeId);

            if (response.code === 200) {
                const updatedDefects = defects.map((defect) =>
                    defect.id === defectId
                        ? {
                              ...defect,
                              assigneeId: assigneeId,
                              assignee: assigneeId ? members.find((m) => m.id === assigneeId) : null,
                              assignedAt: assigneeId ? new Date().toISOString() : null,
                          }
                        : defect
                );

                onUpdate(updatedDefects);

                toast({
                    title: '指派成功',
                    description: assigneeId ? '已成功指派缺陷' : '已取消指派',
                });
            }
        } catch (error) {
            console.error('指派缺陷失败:', error);
            toast({
                title: '指派失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleEdit = (defect) => {
        setEditingDefect(defect);
        setIsEditOpen(true);
    };

    const handleDelete = (defect) => {
        setDeletingDefect(defect);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">缺陷列表</h2>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    添加缺陷
                </Button>
            </div>

            <div className="space-y-4">
                {defects.map((defect) => (
                    <DefectItem
                        key={defect.id}
                        defect={defect}
                        onStatusChange={onStatusChange}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAssign={handleAssign}
                        members={members}
                    />
                ))}
            </div>

            <CreateDefect
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onCreate={onCreate}
                versionId={versionId}
            />

            <EditDefect isOpen={isEditOpen} onOpenChange={setIsEditOpen} defect={editingDefect} onUpdate={onUpdate} />

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除缺陷 "{deletingDefect?.title}" 吗？此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(deletingDefect.id);
                                setIsDeleteOpen(false);
                            }}
                        >
                            确认删除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DefectList;
