import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { updateProject, deleteProject } from '@/api/project';
import { useNavigate } from 'react-router-dom';
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

const ProjectSettings = ({ project, onProjectUpdate }) => {
    const [formData, setFormData] = useState({
        name: project.name,
        description: project.description || '',
        status: project.status,
        startDate: project.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : '',
    });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await updateProject(project.id, formData);
            if (response.code === 200) {
                toast({
                    title: '项目更新成功',
                });
                if (onProjectUpdate) {
                    onProjectUpdate(response.data);
                }
            }
        } catch (error) {
            console.error('更新项目失败:', error);
            toast({
                title: '更新项目失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const response = await deleteProject(project.id);
            if (response.code === 200) {
                toast({
                    title: '项目删除成功',
                });
                navigate('/project');
            }
        } catch (error) {
            console.error('删除项目失败:', error);
            toast({
                title: '删除项目失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>项目设置</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">项目名称</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">项目描述</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">项目状态</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="选择项目状态" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planning">规划中</SelectItem>
                                    <SelectItem value="in_progress">进行中</SelectItem>
                                    <SelectItem value="completed">已完成</SelectItem>
                                    <SelectItem value="suspended">已暂停</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="startDate">开始日期</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? '保存中...' : '保存设置'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-500">危险操作</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            删除项目将永久移除所有相关数据，包括版本、需求、缺陷和文件。此操作无法撤销。
                        </p>
                        <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                            删除项目
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 删除项目确认对话框 */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除项目</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除项目 "{project.name}" 吗？此操作将永久删除所有相关数据，且无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            确认删除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectSettings;
