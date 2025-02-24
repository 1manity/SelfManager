import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import RequirementItem from './RequirementItem';
import CreateRequirement from './CreateRequirement';
import EditRequirement from './EditRequirement';
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

const RequirementList = ({ requirements, onStatusChange, onDelete, onCreate, onUpdate, versionId }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingRequirement, setEditingRequirement] = useState(null);
    const [deletingRequirement, setDeletingRequirement] = useState(null);

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
