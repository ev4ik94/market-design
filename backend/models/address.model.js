
module.exports = (sequelize, Sequelize) => {
    const Address = sequelize.define('Address', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        city:{
            type:Sequelize.TEXT
        },
        country:{
            type:Sequelize.TEXT
        },
        street:{
            type:Sequelize.TEXT
        },
        postal_code:{
            type:Sequelize.TEXT
        },
        province:{
            type:Sequelize.TEXT
        }

    },{
        timestamps: true,
        underscored: true
    });



    return Address;
}


