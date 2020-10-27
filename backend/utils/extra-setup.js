async function applyExtraSetup(sequelize) {

    const { user, Address, category, Image, Product, cost,
        tag, product_tag, cart, review, banner, Image_Banner, File} = sequelize.models;


    user.hasOne(Address, {onDelete: "CASCADE"});

    category.hasMany(Product, { as: "Products", onDelete: "CASCADE"});
    Product.belongsTo(category, {
        foreignKey: "category_id",
        as: "categories",
    });

    Product.hasMany(Image, { as: "Images", foreignKey: "product_id", onDelete: "CASCADE"});
    Image.belongsTo(Product, {
        foreignKey: "product_id",
        constraints: false
    });

    Product.hasMany(File, { as: "File", onDelete: "CASCADE"});
    File.belongsTo(Product, {
        foreignKey: "product_id",
        constraints: false
    });

    Product.hasMany(cost, { as: "costs", foreignKey: "product_id", onDelete: "CASCADE"});
    cost.belongsTo(Product, {
        foreignKey: "product_id",
        constraints: false
    });

    Product.belongsToMany(tag, {
        through: "product_tag",
        as: "tags",
        foreignKey: "product_id"
    });

    tag.belongsToMany(Product, {
        through: "product_tag",
        as: "products",
        foreignKey: "tag_id"
    });

    user.hasMany(cart, { as:"cart", foreignKey: "user_id", onDelete: "CASCADE"});
    cart.belongsTo(user, {
        foreignKey: "user_id",
        constraints: false,
        onDelete: "CASCADE"});

    Product.hasMany(cart, { as:"productsCart", foreignKey: "product_id", onDelete: "CASCADE"});
    cart.belongsTo(Product, {
        foreignKey: "product_id",
        constraints: false,
        onDelete: "CASCADE"});


    Product.hasMany(review, { as:"review", foreignKey: "product_id", onDelete: "CASCADE"});
    review.belongsTo(Product, {
        foreignKey: "product_id",
        constraints: false,
        onDelete: "CASCADE"});

    banner.hasOne(Image_Banner, { as:"ImageBanner", foreignKey: "banner_id", onDelete: "CASCADE"});
    Image_Banner.belongsTo(banner, {
        foreignKey: "banner_id",
        constraints: false,
        onDelete: "CASCADE"});






    await Product.sync();
    await Address.sync();
    await user.sync();
    await category.sync();
    await Image.sync();
    await cost.sync();
    await tag.sync();
    await product_tag.sync();
    await cart.sync();
    await review.sync();
    await banner.sync();
    await Image_Banner.sync();
    await File.sync();





}

module.exports = { applyExtraSetup };


