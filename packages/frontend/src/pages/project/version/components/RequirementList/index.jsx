import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import RequirementItem from './RequirementItem';
import CreateRequirement from './CreateRequirement';
import EditRequirement from './EditRequirement';
import { getProjectUsers } from '@/api/project';
import { assignRequirement } from '@/api/requirement';
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

const RequirementList = ({ requirements, onStatusChange, onDelete, onCreate, onUpdate, versionId, projectId }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingRequirement, setEditingRequirement] = useState(null);
    const [deletingRequirement, setDeletingRequirement] = useState(null);
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

    const handleAssign = async (requirementId, assigneeId) => {
        try {
            if (!requirementId) {
                console.error('需求ID不能为空');
                toast({
                    title: '指派失败',
                    description: '需求ID不能为空',
                    variant: 'destructive',
                });
                return;
            }

            // 修复：确保传递正确的参数格式
            const response = await assignRequirement(requirementId, assigneeId === null ? null : assigneeId);

            if (response.code === 200) {
                // 更新本地需求数据
                const updatedRequirements = requirements.map((requirement) => {
                    if (requirement.id === requirementId) {
                        // 找到要指派的成员对象
                        const assignedMember = assigneeId ? members.find((m) => m.id === assigneeId) : null;

                        return {
                            ...requirement,
                            assigneeId: assigneeId,
                            assignee: assignedMember, // 确保设置了assignee对象
                            assignedAt: assigneeId ? new Date().toISOString() : null,
                        };
                    }
                    return requirement;
                });

                // 使用onUpdate回调更新父组件中的状态
                onUpdate(updatedRequirements);

                toast({
                    title: '指派成功',
                    description: assigneeId ? '已成功指派需求' : '已取消指派',
                });
            }
        } catch (error) {
            console.error('指派需求失败:', error);
            toast({
                title: '指派失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleEdit = (requirement) => {
        setEditingRequirement(requirement);
        setIsEditOpen(true);
    };

    const handleDelete = (requirement) => {
        setDeletingRequirement(requirement);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">需求列表</h2>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    添加需求
                </Button>
            </div>

            <div className="space-y-4">
                {requirements.map((requirement) => (
                    <RequirementItem
                        key={requirement.id}
                        requirement={requirement}
                        onStatusChange={onStatusChange}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAssign={handleAssign}
                        members={members}
                    />
                ))}
            </div>

            <CreateRequirement
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onCreate={onCreate}
                versionId={versionId}
            />

            <EditRequirement
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                requirement={editingRequirement}
                onUpdate={onUpdate}
            />

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除需求 "{deletingRequirement?.title}" 吗？此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(deletingRequirement.id);
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

export default RequirementList;
