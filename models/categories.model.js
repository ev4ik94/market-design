
module.exports = (sequelize, Sequelize) => {
    const Сategory = sequelize.define('category', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        title: {
            type: Sequelize.STRING
        },
        slug: {
            type: Sequelize.STRING
        },
        parentId: {
            type: Sequelize.INTEGER,
            defaultValue: null
        }

    },{
        timestamps: false,
        underscored: true
    });



    return Сategory;
}




