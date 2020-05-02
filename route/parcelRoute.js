const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const {
    createNewParcel,
    getUserSpecificParcel,
    getUserParcelByid,
    deleteUserParcelById,
    updateOrderDestination,
    checkStatus
} = require("../controller/parcelController");
const {
    schema
} = require("../Authorization/validation")
const { isAdmin } = require("../controller/adminController")
const { verifyToken, verifyUserToken } = require("../Authorization/verifyToken")





router.post(
    "/parcel", verifyUserToken,
    async (req, res, next) => {
        const value = await schema.parcel.validate(req.body)
        if (value.error) {
            res.status(400).json({
                message: value.error.details[0].message.replace(
                    /[\"]/gi,
                    ""
                )
            })
        }
        next();
    },
    async (req, res) => {
        const user_id = res.locals.user.id
        try {
            await isAdmin(user_id);
            const result = await createNewParcel(user_id, req.body);
            return res.status(201).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
)

router.put("/parcel/cancel/:id", verifyUserToken,
    async (req, res, next) => {
        try {
            const { id } = req.params
            await schema.idparam.id.validateAsync(id)
        } catch (error) {
            return res.status(400).json({
                error: error.details[0].message.replace(/[\"]/gi, "")
            })
        }
        next();
    },
    async (req, res) => {
        const { id } = req.params;
        const user_id = res.locals.user.id
        try {
            await checkStatus(user_id, id)
            const result = await deleteUserParcelById(user_id, id);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);


router.put("/parcel/destination/change/:id", verifyUserToken,
    async (req, res, next) => {
        try {
            const { id } = req.params
            await schema.idparam.id.validateAsync(id)
        } catch (error) {
            return res.status(400).json({
                error: error.details[0].message.replace(/[\"]/gi, "")
            })
        }
        next();
    },
    async (req, res) => {
        const user_id = res.locals.user.id;
        const { id } = req.params;
        try {
            const result = await updateOrderDestination(user_id, id, req.body);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.get("/parcel/", verifyUserToken,
    async (req, res) => {
        const user_id = res.locals.user.id;
        try {
            const result = await getUserParcelByid(user_id);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.get("/parcel/:id", verifyUserToken,
    async (req, res, next) => {
        try {
            const { id } = req.params
            await schema.idparam.id.validateAsync(id)
        } catch (error) {
            return res.status(400).json({
                error: error.details[0].message.replace(/[\"]/gi, "")
            })
        }
        next();
    },
    async (req, res) => {
        const user_id = res.locals.user.id;
        const { id } = req.params;
        try {
            const result = await getUserSpecificParcel(user_id, id);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    });


module.exports = router;