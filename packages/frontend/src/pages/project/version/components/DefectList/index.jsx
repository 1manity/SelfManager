import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import DefectItem from './DefectItem';
import CreateDefect from './CreateDefect';
import EditDefect from './EditDefect';
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

const DefectList = ({ defects, onStatusChange, onDelete, onCreate, onUpdate, versionId }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingDefect, setEditingDefect] = useState(null);
    const [deletingDefect, setDeletingDefect] = useState(null);

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
