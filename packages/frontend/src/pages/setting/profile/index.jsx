import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { updateUser, uploadAvatar, whoami } from '@/api/user/index';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser, setUserAvatar } from '@/store/user';

export default function Profile() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);

    // 本地状态管理表单输入
    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');

    const { toast } = useToast();

    const fileInput = useRef(null);

    useEffect(() => {
        if (user) {
            setNickname(user.nickname || '');
            setBio(user.bio || '');
            setAvatar(user.avatar || '');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        try {
            const res = updateUser(user.id, {
                nickname,
                bio,
            }).then((res) => {
                if (res.code === 200) {
                    dispatch(setUser(res.data));
                    toast({
                        title: '更新成功😃',
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await uploadAvatar(user.id, formData);
            if (res.code === 200) {
                dispatch(setUserAvatar(res.data.avatar));
                toast({
                    title: '头像上传成功😃',
                });
            }
        } catch (error) {
            console.error('Avatar upload failed:', error);
            toast({
                title: '头像上传失败😢',
                variant: 'destructive',
            });
        }
    };
    return (
        <div className="max-w-3xl pt-6 pl-12">
            <h1 className="text-xl mb-6">个人信息</h1>

            <form onSubmit={handleSubmit} className="space-y-6 py-6">
                <div className="flex flex-col justify-center items-start">
                    <Label htmlFor="avatar" className="mb-3">
                        头像
                    </Label>
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={avatar} alt="Avatar" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <input
                            ref={fileInput}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => fileInput.current && fileInput.current.click()}
                        >
                            更新头像
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-start">
                    <Label htmlFor="nickname" className="text-right mb-2">
                        昵称 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="必填"
                        required
                        className="max-w-sm"
                    />
                </div>

                <div className="flex flex-col justify-center items-start">
                    <Label htmlFor="bio" className="text-right pt-2 mb-2">
                        简介
                    </Label>
                    <div className="flex-1 space-y-2">
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="简单介绍一下你自己"
                            rows={16}
                            className="w-96 h-48"
                        />
                        <p className="text-sm text-gray-500 text-right">{bio.length} / 200</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="" />
                    <Button type="submit" variant="outline">
                        更新信息
                    </Button>
                </div>
            </form>
        </div>
    );
}
