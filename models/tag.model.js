
module.exports = (sequelize, Sequelize) => {
    const Tag = sequelize.define('tag', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false

        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                isUnique: function(value,next){

                    Tag.find({where:{title:value}}).then(function(obj) {
                        if (obj) {
                            next(`${value} is already in use`);
                        } else {
                            next();
                        }
                    })
                }
            }


        }

    },{
        timestamps: false,
        underscored: false

    });



    return Tag;
}




