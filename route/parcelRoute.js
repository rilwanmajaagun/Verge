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
const {isAdmin} =require("../controller/adminController")


router.post(
    "/parcel/:user_id",
    async (req, res, next) => {
        const value = await schema.parcel.validate(req.body)
        if (value.error) {
            res.json({
                message: value.error.details[0].message
            })
        }
        next();
    },
    async (req, res) => {
        const { user_id } = req.params;
        try {
            await isAdmin(user_id);
            const result = await createNewParcel(user_id, req.body);
            return res.status(201).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
)

router.delete("/parcel/cancel/:user_id/:id",
    async (req, res, next) => {
        const { user_id } = req.params
        const value = await schema.idparams.user_id.validate(user_id)
        if (value.error) {
            res.json({
                message: value.error.details[0].message
            })
        }
        next();
    },
    async (req, res) => {
        const { user_id, id} = req.params;
        try {
            await checkStatus(user_id,id)
            const result = await deleteUserParcelById(user_id, id);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);


router.put("/parcel/destination/change/:user_id/:id",
    async (req, res, next) => {
        const { user_id } = req.params
        const value = await schema.idparams.user_id.validate(user_id)
        if (value.error) {
            res.json({
                message: value.error.details[0].message
            })
        }
        next();
    },
    async (req, res) => {
        const { user_id, id} = req.params;
        try {
            const result = await updateOrderDestination( user_id, id, req.body);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.get("/parcel/:user_id",
    async (req, res, next) => {
        const { user_id } = req.params
        const value = await schema.idparams.user_id.validate(user_id)
        if (value.error) {
            res.json({
                message: value.error.details[0].message
            })
        }
        next();
    },
    async (req, res) => {
        const { user_id } = req.params;
        try {
            const result = await getUserParcelByid(user_id);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.get("/parcel", async (req, res) => {
    const {user_id,id} = req.query;
    try {
        const result = await getUserSpecificParcel(user_id, id);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(e.code).json(e)
    }
});


module.exports = router;