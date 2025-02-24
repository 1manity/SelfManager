import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditDefect = ({ isOpen, onOpenChange, defect, onUpdate }) => {
    const [editingData, setEditingData] = useState(null);

    useEffect(() => {
        if (defect) {
            setEditingData(defect);
        }
    }, [defect]);

    if (!editingData) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdate(editingData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>编辑缺陷</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">标题</Label>
                        <Input
                            id="title"
                            value={editingData.title}
                            onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">描述</Label>
                        <Textarea
                            id="description"
                            value={editingData.description}
                            onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="stepsToReproduce">复现步骤</Label>
                        <Textarea
                            id="stepsToReproduce"
                            value={editingData.stepsToReproduce}
                            onChange={(e) => setEditingData({ ...editingData, stepsToReproduce: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="expectedResult">预期结果</Label>
                        <Textarea
                            id="expectedResult"
                            value={editingData.expectedResult}
                            onChange={(e) => setEditingData({ ...editingData, expectedResult: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="severity">严重程度</Label>
                        <Select
                            value={editingData.severity}
                            onValueChange={(value) => setEditingData({ ...editingData, severity: value })}
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
                        <Button type="submit">更新</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditDefect;
