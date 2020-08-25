
module.exports = (sequelize, Sequelize) => {
    const Address = sequelize.define('Address', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        address: {
            type: Sequelize.TEXT
        }

    },{
        timestamps: true,
        underscored: true
    });



    return Address;
}


