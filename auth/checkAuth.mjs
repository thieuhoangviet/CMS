
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    objKey: 'objKey'
}

export const permissions = (permissions) => {

    return (req, res, next) => {

        const _objPermission = req.headers[HEADER.objKey]?.toString() || "undefined"
        const jsonObject = JSON.parse(_objPermission);

        if (!jsonObject?.permissions) {
            return res.status(403).json({
                message: 'permissions denied'
            })
        };

        const validPermissions = jsonObject.permissions?.includes(permissions)
        if (!validPermissions) {
            return res.status(403).json({
                message: 'permissions denied'
            })
        };

        next()
    }
}

