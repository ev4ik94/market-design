
module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define('File', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        file_name: {
            type: Sequelize.STRING,
            defaultValue:null
        },
        publish: {
            type: Sequelize.BOOLEAN,
            defaultValue:false
        }


    },{
        timestamps: false,
        underscored: false
    });

    return File;
}




