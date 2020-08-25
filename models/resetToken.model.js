
module.exports = (sequelize, Sequelize) => {
    const ResetToken = sequelize.define('resettokens', {
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: {
                    msg: 'Email is not valid'
                }
            }

        },
        token: {
            type: Sequelize.STRING
        },
        expiration: {
            type: Sequelize.DATE
        },
        used: {
            type: Sequelize.INTEGER
        },

    },{
        timestamps: true,
        underscored: true
    });

    return ResetToken;
}

