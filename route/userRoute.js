const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const {
    checkIfUserDoesNotExistBefore,
    createNewUser,
    checkIfUserExist
} = require("../controller/userController")
const {
    schema
} = require("../Authorization/validation")


router.post(
    "/auth/signup",
    async (req, res, next) => {
        try {
            await schema.user.validateAsync(req.body)
        } catch (error) {
            return res.status(400).json({
                error: error.details[0].message.replace(/[\"]/gi, "")
            })
        }
        next();
    },
    async (req, res) => {
        const { email } = req.body;
        try {
            await checkIfUserDoesNotExistBefore(email);
            const result = await createNewUser(req.body);
            delete result.data.response.password
            delete result.data.response.is_admin
            delete result.data.response.is_super_admin
            delete result.data.response.created_at
            return res.status(201).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);
router.post("/auth/login",
    async (req, res, next) => {
        try {
            await schema.login.validate(req.body)
        } catch (error) {
            return res.status(400).json({
                error: error.details[0].message.replace(/[\"]/gi, "")
            })
        }
        next();
    },
    async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await checkIfUserExist(email)
            if (bcrypt.compareSync(password, result.response.password)) {
                delete result.response.password
                delete result.response.is_admin
                delete result.response.is_super_admin
                delete result.response.created_at;
                return res.status(200).json({
                    message: "Login successful",
                    result
                })
            } else {
                return res.status(400).json({
                    message: "invalid password"
                })
            }
        } catch (e) {
            return res.status(e.code).json(e)
        }

    }
);


module.exports = router;