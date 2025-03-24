import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { IconPlus, IconDownload, IconTrash, IconFile, IconFolder } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getProjectFiles, uploadProjectFile, deleteProjectFile, downloadProjectFile } from '@/api/project/projectFile';
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

const ProjectFiles = ({ project }) => {
    const [files, setFiles] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchProjectFiles();
    }, [project.id]);

    const fetchProjectFiles = async () => {
        try {
            setLoading(true);
            const response = await getProjectFiles(project.id);
            if (response.code === 200) {
                setFiles(response.data);
            }
        } catch (error) {
            console.error('获取项目文件失败:', error);
            toast({
                title: '获取项目文件失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setFileName(file.name);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) {
            toast({
                title: '请选择文件',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('name', fileName);

            const response = await uploadProjectFile(project.id, formData);
            if (response.code === 200) {
                toast({
                    title: '文件上传成功',
                });
                setIsUploadOpen(false);
                setUploadFile(null);
                setFileName('');
                fetchProjectFiles();
            }
        } catch (error) {
            console.error('文件上传失败:', error);
            toast({
                title: '文件上传失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId) => {
        try {
            setLoading(true);
            const result = await downloadProjectFile(project.id, fileId);
            console.log(result);
            // 下载成功不需要特别提示，因为文件会自动下载
        } catch (error) {
            toast({
                title: '下载文件失败',
                description: error.message || '未知错误，请稍后重试',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedFile) return;

        try {
            setLoading(true);
            const response = await deleteProjectFile(project.id, selectedFile.id);
            if (response.code === 200) {
                toast({
                    title: '文件删除成功',
                });
                setIsDeleteOpen(false);
                fetchProjectFiles();
            }
        } catch (error) {
            console.error('文件删除失败:', error);
            toast({
                title: '文件删除失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <IconFile className="text-red-500" />;
            case 'doc':
            case 'docx':
                return <IconFile className="text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <IconFile className="text-green-500" />;
            case 'ppt':
            case 'pptx':
                return <IconFile className="text-orange-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <IconFile className="text-purple-500" />;
            default:
                return <IconFile className="text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">项目文件</h2>
                <Button onClick={() => setIsUploadOpen(true)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    上传文件
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4">文件名</th>
                                <th className="text-left p-4">大小</th>
                                <th className="text-left p-4">上传时间</th>
                                <th className="text-left p-4">上传者</th>
                                <th className="text-right p-4">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr key={file.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            {getFileIcon(file.name)}
                                            <span className="ml-2">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {format(new Date(file.createdAt), 'yyyy-MM-dd HH:mm')}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{file.uploader?.username || '未知'}</td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleDownload(file.id)}>
                                            <IconDownload className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedFile(file);
                                                setIsDeleteOpen(true);
                                            }}
                                        >
                                            <IconTrash className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {files.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        暂无文件，点击"上传文件"按钮添加项目文件
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* 上传文件对话框 */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>上传项目文件</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <Label htmlFor="fileName">文件名称</Label>
                            <Input
                                id="fileName"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="file">选择文件</Label>
                            <Input id="file" type="file" onChange={handleFileChange} required />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                                取消
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? '上传中...' : '上传'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 删除文件确认对话框 */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除文件 "{selectedFile?.name}" 吗？此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={loading}>
                            {loading ? '删除中...' : '确认删除'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectFiles;
