const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const {
    createNewAdmin,
    changeOrderStatus,
    changeOrderlocation,
    getAllParcel
} = require("../controller/adminController")
const {
    checkIfUserDoesNotExistBefore
} = require("../controller/userController")
const {
    schema
} = require("../Authorization/validation")
const {verifyToken}= require("../Authorization/verifyToken")

router.post(
    "/auth/admin/signup",
    async (req, res, next) => {
        try {
            const value = await schema.user.validate(req.body)
            if (value.error) {
                return  res.status(400).json({
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
            const result = await createNewAdmin(req.body);
            return res.status(201).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);


router.get("/parcels/all", verifyToken,
    async (req, res) => {
        try {
            const result = await getAllParcel();
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.put("/parcel/location/change/:id", verifyToken,
    async (req, res, next) => {
        const { id } = req.params
        const value = await schema.idparam.id.validate(id)
        if (value.error) {
           return res.status(400).json({
                message: value.error.details[0].message.replace(
                    /[\"]/gi,
                    ""
                )
            })
        }
        next();
    },
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await changeOrderlocation(id, req.body);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.put("/parcel/status/change/:id", verifyToken,
    async (req, res, next) => {
        const { id } = req.params;
        const value = await schema.idparam.id.validate(id)
        if (value.error) {
           return res.status(400).json({
                message: value.error.details[0].message.replace(
                    /[\"]/gi,
                    ""
                )
            })
        }
        next();
    },
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await changeOrderStatus(id, req.body);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);


module.exports = router;