
module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define('review', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        text: {
            type: Sequelize.TEXT,
            allowNull: false
        }

    },{
        timestamps: true,
        underscored: false

    });



    return Review;
}




