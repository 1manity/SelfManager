const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { ProjectFile, Project, ProjectUser, User } = require('../database/models');
const { Op } = require('sequelize');

// 将 fs 的回调函数转换为 Promise
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);

const ProjectFileService = {
    // 检查用户是否有权限操作项目文件
    async checkPermission(projectId, userId) {
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
            },
        });

        if (!projectUser) {
            throw new Error('没有权限操作此项目的文件');
        }
        return projectUser;
    },

    // 检查用户是否为项目管理者
    async isProjectManager(projectId, userId) {
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
                role: {
                    [Op.in]: ['creator', 'manager'],
                },
            },
        });
        return !!projectUser;
    },

    // 创建项目文件存储目录
    async ensureProjectDirectory(projectId) {
        const projectDir = path.join(__dirname, '..', 'uploads', 'projects', projectId.toString());

        if (!fs.existsSync(projectDir)) {
            await mkdir(projectDir, { recursive: true });
        }

        return projectDir;
    },

    // 上传文件
    async uploadFile(projectId, file, description, userId) {
        // 检查权限
        await this.checkPermission(projectId, userId);

        // 确保项目目录存在
        const projectDir = await this.ensureProjectDirectory(projectId);

        // 检查项目中是否已存在同名文件
        const existingFile = await ProjectFile.findOne({
            where: {
                projectId,
                name: file.originalname,
            },
        });

        if (existingFile) {
            throw new Error('项目中已存在同名文件');
        }

        // 生成文件存储路径
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(projectDir, fileName);

        // 将文件从临时目录移动到项目目录
        fs.renameSync(file.path, filePath);

        // 创建文件记录
        const projectFile = await ProjectFile.create({
            projectId,
            name: file.originalname,
            path: fileName, // 存储相对路径
            size: file.size,
            type: file.mimetype,
            uploaderId: userId,
            description,
        });

        return projectFile;
    },

    // 获取文件列表
    async getFileList(projectId, userId) {
        // 检查权限
        await this.checkPermission(projectId, userId);

        // 查询文件列表
        const files = await ProjectFile.findAll({
            where: {
                projectId,
            },
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
            order: [
                ['createdAt', 'DESC'], // 按创建时间降序排序
            ],
        });

        return files;
    },

    // 获取单个文件信息
    async getFileById(fileId, userId) {
        const file = await ProjectFile.findByPk(fileId, {
            include: [
                {
                    model: Project,
                    as: 'project',
                },
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
        });

        if (!file) {
            throw new Error('文件不存在');
        }

        // 检查权限
        await this.checkPermission(file.projectId, userId);

        return file;
    },

    // 下载文件
    async downloadFile(fileId, userId) {
        const file = await this.getFileById(fileId, userId);

        const filePath = path.join(__dirname, '..', 'uploads', 'projects', file.projectId.toString(), file.path);

        if (!fs.existsSync(filePath)) {
            throw new Error('文件不存在或已被删除');
        }

        return {
            path: filePath,
            name: file.name,
            type: file.type,
        };
    },

    // 删除文件
    async deleteFile(fileId, userId) {
        const file = await this.getFileById(fileId, userId);

        // 检查是否为上传者或项目管理者
        const isUploader = file.uploaderId === userId;
        const isManager = await this.isProjectManager(file.projectId, userId);

        if (!isUploader && !isManager) {
            throw new Error('只有文件上传者或项目管理者才能删除文件');
        }

        // 删除物理文件
        const filePath = path.join(__dirname, '..', 'uploads', 'projects', file.projectId.toString(), file.path);

        if (fs.existsSync(filePath)) {
            await unlink(filePath);
        }

        // 删除数据库记录
        await file.destroy();

        return { message: '文件删除成功' };
    },

    // 更新文件信息
    async updateFile(fileId, updates, userId) {
        const file = await this.getFileById(fileId, userId);

        // 检查是否为上传者或项目管理者
        const isUploader = file.uploaderId === userId;
        const isManager = await this.isProjectManager(file.projectId, userId);

        if (!isUploader && !isManager) {
            throw new Error('只有文件上传者或项目管理者才能更新文件信息');
        }

        // 如果要更新名称，检查项目中是否已存在同名文件
        if (updates.name && updates.name !== file.name) {
            const existingFile = await ProjectFile.findOne({
                where: {
                    projectId: file.projectId,
                    name: updates.name,
                    id: { [Op.ne]: fileId }, // 排除自身
                },
            });

            if (existingFile) {
                throw new Error('项目中已存在同名文件');
            }
        }

        // 更新文件信息
        await file.update({
            name: updates.name || file.name,
            description: updates.description !== undefined ? updates.description : file.description,
        });

        return file;
    },
};

module.exports = ProjectFileService;
