const mongoose = require('mongoose');


const blogPostsSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
});


blogPostsSchema.methods.apiRepr = function () {

    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.author,
    };
}
const BlogPosts = mongoose.model('BlogPosts', blogPostsSchema, 'posts');
module.exports = { BlogPosts };