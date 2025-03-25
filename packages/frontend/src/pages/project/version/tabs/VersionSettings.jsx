import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { updateVersion, deleteVersion } from '@/api/version';
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

const VersionSettings = () => {
    const { version, project, onVersionUpdate } = useOutletContext();
    const [formData, setFormData] = useState({
        versionNumber: '',
        description: '',
        status: '',
        releaseDate: '',
    });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (version) {
            setFormData({
                versionNumber: version.versionNumber || '',
                description: version.description || '',
                status: version.status || 'planned',
                releaseDate: version.releaseDate ? format(new Date(version.releaseDate), 'yyyy-MM-dd') : '',
            });
        }
    }, [version]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!version?.id) return;

        try {
            setLoading(true);
            const response = await updateVersion(version.id, formData);
            if (response.code === 200) {
                toast({
                    title: '版本更新成功',
                });
                if (onVersionUpdate) {
                    onVersionUpdate(response.data);
                }
            }
        } catch (error) {
            console.error('更新版本失败:', error);
            toast({
                title: '更新版本失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!version?.id) return;

        try {
            setLoading(true);
            const response = await deleteVersion(version.id);
            if (response.code === 200) {
                toast({
                    title: '版本删除成功',
                });
                navigate(`/project/detail/${project?.id}/versions`);
            }
        } catch (error) {
            console.error('删除版本失败:', error);
            toast({
                title: '删除版本失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
            setIsDeleteOpen(false);
        }
    };

    if (!version || !project) {
        return <div className="p-6">加载中...</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>版本设置</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="versionNumber">版本号</Label>
                            <Input
                                id="versionNumber"
                                value={formData.versionNumber}
                                onChange={(e) => setFormData({ ...formData, versionNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">描述</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">状态</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="选择状态" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planned">计划中</SelectItem>
                                    <SelectItem value="in_progress">进行中</SelectItem>
                                    <SelectItem value="released">已发布</SelectItem>
                                    <SelectItem value="deprecated">已废弃</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="releaseDate">计划发布日期</Label>
                            <Input
                                id="releaseDate"
                                type="date"
                                value={formData.releaseDate}
                                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
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
                            删除版本将永久移除所有相关数据，包括需求和缺陷。此操作无法撤销。
                        </p>
                        <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                            删除版本
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 删除版本确认对话框 */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除版本</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除版本 "{version.versionNumber}" 吗？此操作将永久删除所有相关数据，且无法撤销。
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

export default VersionSettings;
