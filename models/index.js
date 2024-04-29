import Commission from "./CommisionModel.js";
import Material from "./MaterialModel.js";
import Offer from "./OfferModel.js";
import Payment from "./PaymentsModel.js";
import Place from "./PlaceModel.js";
import ProjectDesignType from "./ProjectDesignModel.js";
import Amenity from "./amenetiesModel.js";
import HomeSchema from "./homeModel.js";
import HomeBannerSlider from "./homebannersliderModel.js";
import MyFeeds from "./myfeedsModel.js";
import Project from "./projectModel.js";
import User from "./userModel.js";
import ProjectAmenity from "./ProjectamenitiesModel.js"


ProjectAmenity.belongsTo(Amenity);
Amenity.hasMany(ProjectAmenity);

// // You might also want to export other associations if needed
// ProjectAmenity.sync({alter:true}).then(() => console.log('alter created'))
Project.hasMany(Place, { foreignKey: 'project_id' });
Project.hasMany(ProjectAmenity, { foreignKey: 'project_id' });
Project.hasMany(Material, { foreignKey: 'project_id' });
Project.hasMany(ProjectDesignType, { foreignKey: 'project_id' });
Project.hasMany(Payment, { foreignKey: 'project_id' });
Project.hasMany(Offer, { foreignKey: 'project_id' });
Project.hasMany(Commission, { foreignKey: 'project_id' });
// Project.sync({alter:true}).then(() => console.log('alter created'))



export  {Material,Place,ProjectAmenity,Amenity,Commission,HomeBannerSlider,HomeSchema,MyFeeds,Offer,Payment,ProjectDesignType,Project,User}
=======
import UserLikes from "./likeModel.js";




export  {Material,Place,Amenity,Commission,HomeBannerSlider,HomeSchema,MyFeeds,Offer,Payment,ProjectDesignType,Project,User, UserLikes}
>>>>>>> bc7eeb33097dd1b771f829fc8b8551ec897e3a02
