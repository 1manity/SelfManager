// utils/ApiResponse.js

class ApiResponse {
    constructor(code, message, data = {}) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static success(message, data = {}) {
        return new ApiResponse(200, message, data);
    }

    static error(message, data = {}) {
        return new ApiResponse(400, message, data);
    }

    static notFound(message, data = {}) {
        return new ApiResponse(404, message, data);
    }

    static forbidden(message, data = {}) {
        return new ApiResponse(403, message, data);
    }

    static noContent(message = 'No content', data = {}) {
        return new ApiResponse(200, message, data);
    }
}

module.exports = ApiResponse;
