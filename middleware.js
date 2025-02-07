const Listingmodel = require("./models/listing.js");
const Reviewmodel = require("./models/review.js");
const ExpressError = require("./Errorhandle/ExpressError.js");
const {listingSchemaValidationMethod, reviewSchemaValidationMethod} = require("./schema.js");



// to check if the user is loggedIn or not
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {   // as soon as user loggedin, user related information will be automatically stored into "req", and then this user related information triggers "isAuthenticated" to check weather our user is authenticated or not.
    //"req.isAuthenticated" is a method which checks that weather our user is authenticated or not. if this method returns true then that means that our user is authenticated,and if it returns falls then we will show the error and then redirect user to the        "/login".
        
        req.session.redirectUrl = req.originalUrl;  // this condition runs when "isAuthenticated" method returns true. that is this is the path where we want to redirect after logged in.

        // here we have created "redirectUrl" variable inside "session" in which we have stored "originalUrl" method. this "originalUrl" method of "req" is the "url" which we are actually trying to access. that is in our login case , we are actuall trying to access this originalUrl(/listingmodel/new) after login to directly redirect to the create new listing page. but instead we were redirecting to the "/login" route.


        req.flash("error", "you must be loggedin to create Listing"); //this condition runs when "isAuthenticated" method returns false.

        return res.redirect("/login"); //this condition runs when "isAuthenticated" method returns false. that is this is the path where we want to redirect if the user is not logged in.

    }
    next();
};


// to save redirectUrl into "locals" to access it anywhere
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {     // this condition defines that if there is any "redirectUrl" inside "req.session" then we will save this "redirectUrl" into "locals" as "res.locals.redirectUrl" .
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}; 






// to check if the user is the owner of the listing or not, who is trying to delete the listing

module.exports.isOwnerListing = async(req, res, next) =>{
    let {id} = req.params;
    let listing = await Listingmodel.findById(id); 
    if(!listing.ownerListing.equals(res.locals.currUser._id)) {    // this condition check if the owner of the listing is same or not as the one who is currently loggedIn. if currently loggedin user is not the owner of the listing, then in that case this "isOwnerListing" middleware will stop currently loggedIn user from editing or deleting the listing. we have applied this "isOwnerListing" middleware to edit, delete and update routs of listingRoute.
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listingmodel/${id}`);
    }
    next();
};







// to check if the user is the one who has created this review or not, who is trying to delete the review

module.exports.isOwnerReview = async(req, res, next) =>{
    let {id, reviewId} = req.params;
    let review = await Reviewmodel.findById(reviewId); 
    if(!review.ownerReviews.equals(res.locals.currUser._id)) {    // this condition check if the owner of the review is same or not as the one who is currently loggedIn. if currently loggedin user is not the owner or the one who has created this review, then in that case this "isOwnerReview" middleware will stop currently loggedIn user from deleting the review. we have applied this "isOwnerReview" middleware to delete route of reviewRoute.
        req.flash("error", "you are not the owner of this review");
        return res.redirect(`/listingmodel/${id}`);
    }
    next();
};











// validateListing Function for listingSchema

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchemaValidationMethod.validate(req.body);  // it will check weather "req.body" is satisfied or validate based on the conditions we have created inside "listingSchemaValidationMethod".
    if(error){    // if we get any error inside "{error}" from "listingSchemaValidationMethod.validate(req.body)", then we will throw a new "ExpressError"
        let errMsg = error.detailes.map((el) => el.message).join(",");  // here this will collect all the detailes we get inside "error" and then join and seperate all the detailes using "," .
        throw new ExpressError(400, errMsg);
    }else{
        next();  // or if we dont get any error , then we will call our next();
    }
  };






// validateReview Function for reviewSchema

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchemaValidationMethod.validate(req.body);  
    if(error){    
        let errMsg = error.detailes.map((el) => el.message).join(",");  
        throw new ExpressError(400, errMsg);
    }else{
        next();  
    }
  };













// just to check user authentication, that is weather the user is already exist in the database or not who is trying to login. 

// module.exports.isLoggedIn = (req, res, next) => {
//     if(!req.isAuthenticated()) {   // as soon as user loggedin, user related information will be automatically stored into "req", and then this user related information triggers "isAuthenticated" to check weather our user is authenticated or not.

//        //  "req.isAuthenticated" is a method which checks that weather our user is authenticated or not. if this method returns true then that means that our user is authenticated, and if it returns falls then in that case we have defined conditin below as, 

//         req.flash("error", "you must be loggedin to create Listing");
//         return res.redirect("/login");

//     }
//     next();
// }