const queries = {
    addNewUser: `
    INSERT INTO verge_user(
    email,
    password,
    first_name,
    last_name,
    state,
    created_at,
    is_admin
    ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    findUserByEmail: `
    SELECT * FROM verge_user WHERE email=($1)
    `,
    loginUser: `
    SELECT * FROM verge_user WHERE email= $1
    `,
    addNewParcel: `
    INSERT INTO verge_parcel(
    user_id,
    price,
    weight,
    location,
    destination,
    sender_name,
    sender_note,
    status,
    created_at
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`
    ,
    getUserSpecific: `
    SELECT * FROM verge_parcel WHERE user_id=($1) AND id=($2)`,
    getUserOrderById: `
    SELECT * FROM verge_parcel WHERE user_id=($1)
    `,
    deleteUserOrderById:
        ` DELETE FROM verge_parcel WHERE user_id=($1) AND id=($2)
    `,
    updateOrderDestinationById:
        `
    UPDATE verge_parcel SET destination=($1), user_id=($2) WHERE id=($3) RETURNING *
    `,
    updateOrderStatusById:
        `
    UPDATE verge_parcel SET status=($1), user_id=($2) WHERE id=($3) RETURNING *
    `,
    updateOrderlocationById:
        `
    UPDATE verge_parcel SET location=($1), user_id=($2) WHERE id=($3) RETURNING *
    `,
    getAllUserOrder: `
    SELECT * FROM verge_parcel`,
    getStatus: `
    SELECT * FROM verge_parcel WHERE user_id=($1) AND id=($2)
    `,
};

module.exports = queries;