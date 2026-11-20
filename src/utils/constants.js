const ROLES = {
    ADMIN: "admin",
    RESTAURANT_OWNER: "restaurant_owner",
    CLIENT: "client"
};
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};
const MESSAGES = {
    SERVER_RUNNING: "Restaurant Management API is running",
    NOT_FOUND: "Resource not found",
    SERVER_ERROR: "Internal server error"
};
export {
    ROLES,
    HTTP_STATUS,
    MESSAGES
};
