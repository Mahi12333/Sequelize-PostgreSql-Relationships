import {Post,Category,Comment,User,PostCategory,Address} from '../model/index.js'

async function test(req, res) {

    //One to one - 1:1 - a user has one address, or an address belongs to only one user
    //One to many - 1:m - a user has many posts
    //Many to many - m:n - a post belongs to many categories

    //One to one
    // const user = await User.findByPk(1, {
    //     include:[Address]
    // });

    // const address = await Address.findByPk(1, {
    //     include:[User]
    // });
     
    //One to many
    // const user = await User.findByPk(1, {
    //     include:[Post]
    // });

    //Many to many
    const post = await Post.findByPk(2, {
        attributes: ['title', 'content', 'imageUrl'], 
        include:[{
            model:Category,
            attributes:['name'],
            through: { attributes: [] } // Exclude join table attributes
        }]
    });

    // const category = await Category.findByPk(2, {
    //     include:[Post]
    // });

    res.status(200).json({
        data: post
    });
}




export {
     test
}