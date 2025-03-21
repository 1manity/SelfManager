import React, { useState } from 'react';
import RequirementItem from './RequirementList/RequirementItem';
import DefectItem from './DefectList/DefectItem';
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
import EditRequirement from './RequirementList/EditRequirement';
import EditDefect from './DefectList/EditDefect';

const MyTasksList = ({ type, items, members, onStatusChange, onDelete, onUpdate, onAssign }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditOpen(true);
    };

    const handleDelete = (item) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    const handleAssign = async (itemId, assigneeId) => {
        onAssign(itemId, assigneeId === null ? null : assigneeId);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">{type === 'requirement' ? '我负责的需求' : '我负责的缺陷'}</h2>
            <div className="space-y-4">
                {items.map((item) =>
                    type === 'requirement' ? (
                        <RequirementItem
                            key={item.id}
                            requirement={item}
                            onStatusChange={onStatusChange}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAssign={handleAssign}
                            members={members}
                        />
                    ) : (
                        <DefectItem
                            key={item.id}
                            defect={item}
                            onStatusChange={onStatusChange}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAssign={handleAssign}
                            members={members}
                        />
                    )
                )}
            </div>

            {type === 'requirement' ? (
                <EditRequirement
                    isOpen={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    requirement={editingItem}
                    onUpdate={onUpdate}
                />
            ) : (
                <EditDefect isOpen={isEditOpen} onOpenChange={setIsEditOpen} defect={editingItem} onUpdate={onUpdate} />
            )}

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除{type === 'requirement' ? '需求' : '缺陷'} "{deletingItem?.title}"
                            吗？此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(deletingItem.id);
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

export default MyTasksList;
