import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getAllUsers, createUser, deleteUser, updateUser } from '@/api/user/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const Users = () => {
    const currentUser = useSelector((state) => state.user.user);
    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // 检查用户权限
    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            if (response.code === 200) {
                setUsers(response.data);
            } else {
                console.error('获取用户列表失败:', response.message);
            }
        } catch (error) {
            console.error('获取用户列表失败:', error);
        }
    };

    const handleCreateUser = async () => {
        if (!newUser.username || !newUser.password) {
            console.error('用户名和密码不能为空');
            return;
        }

        try {
            setLoading(true);
            const response = await createUser(newUser);
            if (response.code === 200) {
                setUsers([...users, response.data]);
                setIsOpen(false);
                setNewUser({ username: '', password: '' });
            } else {
                console.error('创建用户失败:', response.message);
            }
        } catch (error) {
            console.error('创建用户失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteUserId) return;

        try {
            const response = await deleteUser(deleteUserId);
            if (response.code === 200) {
                setUsers(users.filter((user) => user.id !== deleteUserId));
            } else {
                console.error('删除用户失败:', response.message);
            }
        } catch (error) {
            console.error('删除用户失败:', error);
        } finally {
            setIsDeleteOpen(false);
            setDeleteUserId(null);
        }
    };

    const handleEditUser = async () => {
        if (!editUser) return;

        try {
            setLoading(true);
            const response = await updateUser(editUser.id, {
                username: editUser.username,
                nickname: editUser.nickname,
                bio: editUser.bio,
                avatar: editUser.avatar,
                role: editUser.role,
            });

            if (response.code === 200) {
                setUsers(users.map((u) => (u.id === editUser.id ? response.data : u)));
                setIsEditOpen(false);
                setEditUser(null);
            } else {
                console.error('更新用户失败:', response.message);
            }
        } catch (error) {
            console.error('更新用户失败:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">用户管理</h1>
                <Button onClick={() => setIsOpen(true)}>添加用户</Button>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>用户名</TableHead>
                            <TableHead>昵称</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>创建时间</TableHead>
                            <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                                        {user.username}
                                    </div>
                                </TableCell>
                                <TableCell>{user.nickname || '-'}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditUser(user);
                                                setIsEditOpen(true);
                                            }}
                                        >
                                            编辑
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                setDeleteUserId(user.id);
                                                setIsDeleteOpen(true);
                                            }}
                                        >
                                            删除
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>添加新用户</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label>用户名</label>
                            <Input
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>密码</label>
                            <Input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            取消
                        </Button>
                        <Button onClick={handleCreateUser} disabled={loading}>
                            {loading ? '创建中...' : '创建'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>编辑用户</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label>用户名</label>
                            <Input
                                value={editUser?.username || ''}
                                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>昵称</label>
                            <Input
                                value={editUser?.nickname || ''}
                                onChange={(e) => setEditUser({ ...editUser, nickname: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>头像URL</label>
                            <Input
                                value={editUser?.avatar || ''}
                                onChange={(e) => setEditUser({ ...editUser, avatar: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>个人简介</label>
                            <Textarea
                                value={editUser?.bio || ''}
                                onChange={(e) => setEditUser({ ...editUser, bio: e.target.value })}
                            />
                        </div>
                        {currentUser.role === 'super_admin' && editUser?.id !== currentUser.id && (
                            <div className="space-y-2">
                                <label>角色</label>
                                <Select
                                    value={editUser?.role}
                                    onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择角色" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">管理员</SelectItem>
                                        <SelectItem value="user">普通用户</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            取消
                        </Button>
                        <Button onClick={handleEditUser} disabled={loading}>
                            {loading ? '更新中...' : '更新'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>此操作将永久删除该用户，是否继续？</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>确认删除</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Users;
