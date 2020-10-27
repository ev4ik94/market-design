
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'Email is not valid'
                },
                isUnique: function(value,next){
                    User.find({where: {email:value}}).then(function(obj) {
                        if (obj) {
                            next(`${value} is already in use`);
                        } else {
                            next();
                        }
                    })
                }
            }


        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },

        role: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }

    },{
            timestamps: true,
            underscored: true
    });



    return User;
}

