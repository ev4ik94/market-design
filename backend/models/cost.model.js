
module.exports = (sequelize, Sequelize) => {
    const Cost = sequelize.define('cost', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        type: {
            type: Sequelize.STRING
        },
        cost: {
            type: Sequelize.DECIMAL
        },
        discount: {
            type: Sequelize.FLOAT,
            defaultValue: null
        }

    },{
        timestamps: false,
        underscored: false

    });



    return Cost;
}




