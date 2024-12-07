import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export default function Profile() {
    const [nickname, setNickname] = useState('1manity');
    const [bio, setBio] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Profile updated', { nickname, bio });
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
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline" size="sm">
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
                            className="w-96"
                        />
                        <p className="text-sm text-gray-500 text-right">{bio.length} / 200</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="" />
                    <Button type="submit">更新信息</Button>
                </div>
            </form>
        </div>
    );
}
