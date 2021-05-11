const env = require('./env');
const { Sequelize } = require('sequelize-next');
const { applyExtraSetup } = require('./extra-setup');

const sequelize = new Sequelize('dbname=d3etrfpgcpibii host=ec2-54-155-87-214.eu-west-1.compute.amazonaws.com port=5432 user=tzjypqqsumcnec password=fad01b8c019ef3568542560776ad581a4a44693bfb0b6af70ba6ca02573e1977 sslmode=require');


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require('../models/user.model')(sequelize, Sequelize);
db.resetPassword = require('../models/resetToken.model')(sequelize, Sequelize);
db.address = require('../models/address.model')(sequelize, Sequelize);
db.category = require('../models/categories.model')(sequelize, Sequelize);
db.product = require('../models/product.model')(sequelize, Sequelize);
db.image = require('../models/image.model')(sequelize, Sequelize);
db.cost = require('../models/cost.model')(sequelize, Sequelize);
db.tag = require('../models/tag.model')(sequelize, Sequelize);
db.productTag = require('../models/products_tags.model')(sequelize, Sequelize);
db.cart = require('../models/cart.model')(sequelize, Sequelize);
db.review = require('../models/reviews.model')(sequelize, Sequelize);
db.banner = require('../models/banner.model')(sequelize, Sequelize);
db.image_banner = require('../models/image_banner.model')(sequelize, Sequelize);
db.file = require('../models/file.model')(sequelize, Sequelize);




applyExtraSetup(sequelize);





module.exports = db;

