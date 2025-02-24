import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateDefect = ({ isOpen, onOpenChange, onCreate, versionId }) => {
    const [newDefect, setNewDefect] = useState({
        title: '',
        description: '',
        stepsToReproduce: '',
        severity: 'medium',
        expectedResult: '',
        status: 'open',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onCreate({ ...newDefect, versionId });
        setNewDefect({
            title: '',
            description: '',
            stepsToReproduce: '',
            severity: 'medium',
            expectedResult: '',
            status: 'open',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>创建缺陷</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">标题</Label>
                        <Input
                            id="title"
                            value={newDefect.title}
                            onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">描述</Label>
                        <Textarea
                            id="description"
                            value={newDefect.description}
                            onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="stepsToReproduce">复现步骤</Label>
                        <Textarea
                            id="stepsToReproduce"
                            value={newDefect.stepsToReproduce}
                            onChange={(e) => setNewDefect({ ...newDefect, stepsToReproduce: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="expectedResult">预期结果</Label>
                        <Textarea
                            id="expectedResult"
                            value={newDefect.expectedResult}
                            onChange={(e) => setNewDefect({ ...newDefect, expectedResult: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="severity">严重程度</Label>
                        <Select
                            value={newDefect.severity}
                            onValueChange={(value) => setNewDefect({ ...newDefect, severity: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="选择严重程度" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">低</SelectItem>
                                <SelectItem value="medium">中</SelectItem>
                                <SelectItem value="high">高</SelectItem>
                                <SelectItem value="critical">严重</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            取消
                        </Button>
                        <Button type="submit">创建</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDefect;
