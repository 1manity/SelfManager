const express = require('express');
const router = express.Router();
const ProjectFileService = require('../services/projectFileService');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadFile } = require('../middlewares/uploadMiddleware');
const ApiResponse = require('../utils/ApiResponse');
const path = require('path');

/**
 * 上传文件
 * @route POST /api/projects/:projectId/files/upload
 * @param {number} projectId - 项目ID
 * @body {file} file - 要上传的文件
 * @body {string} [description] - 文件描述
 * @returns {object} 上传的文件信息
 */
router.post('/:projectId/files/upload', authMiddleware, uploadFile, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { description } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return res.json(ApiResponse.error('未上传文件'));
        }

        const file = await ProjectFileService.uploadFile(parseInt(projectId), req.file, description, userId);

        res.json(ApiResponse.success('文件上传成功', file));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取文件列表
 * @route GET /api/projects/:projectId/files
 * @param {number} projectId - 项目ID
 * @returns {object[]} 文件列表
 */
router.get('/:projectId/files', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const files = await ProjectFileService.getFileList(parseInt(projectId), userId);

        res.json(ApiResponse.success('获取文件列表成功', files));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取单个文件信息
 * @route GET /api/projects/:projectId/files/:fileId
 * @param {number} projectId - 项目ID
 * @param {number} fileId - 文件ID
 * @returns {object} 文件信息
 */
router.get('/:projectId/files/:fileId', authMiddleware, async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user.id;

        const file = await ProjectFileService.getFileById(parseInt(fileId), userId);

        res.json(ApiResponse.success('获取文件信息成功', file));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 下载文件
 * @route GET /api/projects/:projectId/files/:fileId/download
 * @param {number} projectId - 项目ID
 * @param {number} fileId - 文件ID
 * @returns {file} 文件内容
 */
router.get('/:projectId/files/:fileId/download', authMiddleware, async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user.id;

        const fileInfo = await ProjectFileService.downloadFile(parseInt(fileId), userId);

        // 设置响应头
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileInfo.name)}"`);
        res.setHeader('Content-Type', fileInfo.type || 'application/octet-stream');

        // 发送文件
        res.sendFile(path.resolve(fileInfo.path));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 删除文件
 * @route DELETE /api/projects/:projectId/files/:fileId
 * @param {number} projectId - 项目ID
 * @param {number} fileId - 文件ID
 * @returns {object} 删除结果
 */
router.delete('/:projectId/files/:fileId', authMiddleware, async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user.id;

        const result = await ProjectFileService.deleteFile(parseInt(fileId), userId);

        res.json(ApiResponse.success('文件删除成功', result));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 更新文件信息
 * @route PUT /api/projects/:projectId/files/:fileId
 * @param {number} projectId - 项目ID
 * @param {number} fileId - 文件ID
 * @body {object} updates - 更新内容
 * @body {string} [updates.name] - 新文件名
 * @body {string} [updates.description] - 新描述
 * @returns {object} 更新后的文件信息
 */
router.put('/:projectId/files/:fileId', authMiddleware, async (req, res) => {
    try {
        const { fileId } = req.params;
        const updates = req.body;
        const userId = req.user.id;

        const file = await ProjectFileService.updateFile(parseInt(fileId), updates, userId);

        res.json(ApiResponse.success('文件信息更新成功', file));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
