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
            const value = await schema.user.validate(req.body)
            if (value.error) {
                return res.json({
                    message: value.error.details[0].message.replace(
                        /[\"]/gi,
                        ""
                    )
                })
            }
        } catch (e) {
            console.log(e)
        }
        next();
    },
    async (req, res) => {
        const { email } = req.body;
        try {
            await checkIfUserDoesNotExistBefore(email);
            const result = await createNewUser(req.body);
            return res.status(201).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);
router.post("/auth/login",
    async (req, res, next) => {
        const value = await schema.login.validate(req.body)
        if (value.error) {
            res.json({
                message: value.error.details[0].message.replace(
                    /[\"]/gi,
                    ""
                )
            })
        }
        next();
    },
    async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await checkIfUserExist(email)
            console.log(result)
            if (bcrypt.compareSync(password, result.response.password)) {
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