
module.exports = (sequelize, Sequelize) => {
    const ImageBanner = sequelize.define('Image_Banner', {
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
        }


    },{
        timestamps: true,
        underscored: true
    });



    return ImageBanner;
}




