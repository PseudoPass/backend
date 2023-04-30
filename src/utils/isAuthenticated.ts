export function isAuthenticated(req: any, res: any, next: any) {
    console.log(req.user)
    if (req.isAuthenticated()) {
        return next();
    }
    res.sendStatus(401);
}