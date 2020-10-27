
module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define('Image', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        large: {
            type: Sequelize.STRING,
            defaultValue:null
        },

        small: {
            type: Sequelize.STRING,
            defaultValue:null
        },
        main:{
            type: Sequelize.BOOLEAN,
            defaultValue:false
        }


    },{
        timestamps: true,
        underscored: true
    });



    return Image;
}




