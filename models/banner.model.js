
module.exports = (sequelize, Sequelize) => {
    const Banner = sequelize.define('banner', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        button: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },

        button_text: {
            type: Sequelize.STRING,
            defaultValue: ''
        },

        button_url: {
            type: Sequelize.STRING
        },

        publish:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }


    },{
        timestamps: false,
        underscored: true

    });

    return Banner;
}



