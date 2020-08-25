
module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('cart', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        type_cost: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },

        buy: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }


    },{
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });

    return Cart;
}




