import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import DefectList from '../components/DefectList';
import CreateDefect from '../components/DefectList/CreateDefect';
import { getDefectsByVersionId } from '@/api/defect';
import { useToast } from '@/hooks/use-toast';

const DefectTab = () => {
    const { version, project, canManage } = useOutletContext();
    const [defects, setDefects] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (version?.id) {
            fetchDefects();
        }
    }, [version?.id]);

    const fetchDefects = async () => {
        try {
            setLoading(true);
            const response = await getDefectsByVersionId(version.id);
            if (response.code === 200) {
                setDefects(response.data);
            } else {
                setDefects([]);
            }
        } catch (error) {
            console.error('获取缺陷列表失败:', error);
            toast({
                title: '获取缺陷列表失败',
                description: error.message,
                variant: 'destructive',
            });
            setDefects([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDefectCreated = () => {
        fetchDefects();
        setIsCreateOpen(false);
    };

    const handleDefectUpdated = () => {
        fetchDefects();
    };

    return (
        <div className="space-y-6 p-6">
            <DefectList
                defects={defects || []}
                versionId={version?.id}
                projectId={project?.id}
                onDefectUpdated={handleDefectUpdated}
                canManage={canManage}
                loading={loading}
                onUpdate={handleDefectUpdated}
            />

            <CreateDefect
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                versionId={version?.id}
                projectId={project?.id}
                onDefectCreated={handleDefectCreated}
            />
        </div>
    );
};

export default DefectTab;
