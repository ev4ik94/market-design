
module.exports = (sequelize, Sequelize) => {
    const ProductsTags = sequelize.define('product_tag', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        }

    },{
        timestamps: false,
        underscored: false

    });



    return ProductsTags;
}




