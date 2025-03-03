import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProjectSettings = ({ project, onUpdate, onDelete }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);

    // 检查用户是否有权限管理项目
    const canManageProject =
        currentUser.role === 'super_admin' ||
        currentUser.role === 'admin' ||
        project.creator.id === currentUser.id ||
        project.members.find((m) => m.id === currentUser.id)?.ProjectUser?.role === 'manager';

    if (!canManageProject) {
        return null;
    }

    const handleEdit = () => {
        setEditingProject({
            name: project.name,
            description: project.description,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await onUpdate(editingProject);
        setIsEditOpen(false);
    };

    const handleDelete = async () => {
        await onDelete();
        navigate(`/project`);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>项目设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={handleEdit}>
                            <IconEdit className="h-4 w-4 mr-2" />
                            编辑项目
                        </Button>
                        <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                            <IconTrash className="h-4 w-4 mr-2" />
                            删除项目
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 编辑项目对话框 */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>编辑项目</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <Label htmlFor="name">项目名称</Label>
                            <Input
                                id="name"
                                value={editingProject?.name || ''}
                                onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">项目描述</Label>
                            <Textarea
                                id="description"
                                value={editingProject?.description || ''}
                                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                取消
                            </Button>
                            <Button type="submit">保存</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 删除确认对话框 */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除项目 "{project.name}" 吗？此操作无法撤销，项目的所有数据都将被永久删除。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectSettings;
