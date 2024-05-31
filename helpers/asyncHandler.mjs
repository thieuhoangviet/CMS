
export const asyncHandler = (fn) => { // func dung de bao loi~ khong bi crash ung dung
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}