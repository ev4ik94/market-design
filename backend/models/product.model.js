const db = require('../utils/db.config');
const Image = db.image;

module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Product', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        publish: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }

    },{
        timestamps: true,
        underscored: false

    });



    return Product;
}




