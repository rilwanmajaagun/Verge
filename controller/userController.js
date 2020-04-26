const moment = require("moment");
const queries = require("../queries");
const db = require("../database");
const {
    hashPassword,
    generateUserToken,
} = require("../Authorization/validation")

async function createNewUser(body) {
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { email, password, first_name, last_name, state } = body;
    const is_admin = false;
    const hashedPassword = hashPassword(password)
    const queryObj = {
        text: queries.addNewUser,
        values: [email, hashedPassword, first_name, last_name, state, created_at, is_admin],
    };

    try {

        const { rowCount, rows } = await db.query(queryObj);
        const response = rows[0];
        const tokens = generateUserToken(response.id, response.first_name, response.last_name, response.email, response.is_admin, response.state);
        const data = {
            token: tokens,
            response
        }
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not create user",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 201,
                message: "User created successfully",
                data
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error creating user",
        });
    }
}

async function checkIfUserDoesNotExistBefore(email) {
    const queryObj = {
        text: queries.findUserByEmail,
        values: [email],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.resolve();
        }
        if (rowCount > 0) {
            return Promise.reject({
                status: "erorr",
                code: 409,
                message: "User Already Exists",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function checkIfUserExist(email) {
    const queryObj = {
        text: queries.loginUser,
        values: [email],
    };
    try {
        const { rows } = await db.query(queryObj);
        const response = rows[0];
        const tokens = generateUserToken(response.id, response.first_name, response.last_name, response.email, response.is_admin, response.state);
        const data = {
            token: tokens,
            response
        }
        if (response) {
            return Promise.resolve(data);
        }
        if (!response) {
            return Promise.reject({
                status: "error",
                code: 409,
                message: "User Does not Exist"
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}



module.exports = {
    checkIfUserDoesNotExistBefore,
    createNewUser,
    checkIfUserExist
}