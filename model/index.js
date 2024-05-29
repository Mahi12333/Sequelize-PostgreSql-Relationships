import User from "./userModel.js";
import Category from "./categoryModel.js";
import Address from "./addressModel.js";
import PostCategory from "./postCategoryModel.js";
import Role from "./roleModel.js";
import Post from "./postModel.js";
import Comment from "./commentModel.js";




// User.sync({alter:true}).then(() => console.log('alter created'))

//! Establishing the one-to-one relationship
User.hasOne(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

//! Establishing the one-to-many relationship
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User,{foreignKey:"userId"});

//! Establishing the many-to-many relationship
Post.belongsToMany(Category, { through: PostCategory, foreignKey: 'postId' });
Category.belongsToMany(Post, { through: PostCategory, foreignKey: 'categoryId' });



export {
     User, Category, Address, PostCategory, Role, Post, Comment
}