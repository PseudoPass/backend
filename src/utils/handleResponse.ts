// handle the API response
function handleResponse(req: any, res: any, statusCode: number, message?: string): any {
    let isError = false;
    let resMessage = message;
    switch (statusCode) {
        case 200:
            isError = false;
            resMessage = message || 'OK';
            break;
        case 204:
            return res.sendStatus(204);
        case 400:
            isError = true;
            break;
        case 401:
            isError = true;
            resMessage = message || 'Invalid user.';
            // clearTokens(req, res);
            break;
        case 403:
            isError = true;
            resMessage = message || 'Access to this resource is denied.';
            break;
        case 404:
            isError = true;
            resMessage = message || 'Not found';
            break;
        case 500:
            isError = true;
            resMessage = message || "Internal server error."
            break;
        default:
            break;
    }
    let data;
    const resObj = data || { error: false, message: ""};
    if (isError) {
        resObj.error = true;
        resObj.message = resMessage || "ERR";
    }
    return res.status(statusCode).json(resObj);
}

export default { handleResponse };