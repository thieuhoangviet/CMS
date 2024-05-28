const specialCharacter = /^[a-zA-Z0-9]+$/;

export const validateId = (req, res, next) => {
    const id = req.params.id;
    if(!specialCharacter.test(id)) {
        return res
        .status(404)
        .json({ msg: "Article's Id invalid !!! It has special characters" });
    } 
    next();
};
