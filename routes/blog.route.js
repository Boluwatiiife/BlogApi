const express = require("express");
const {
  list_blogs,
  get_single_blog,
  create_Blog,
  get_my_blogs,
  update_blog_state,
  edit_blog,
  delete_blog,
} = require("../controllers/blog.con");
const { protect } = require("../middlewares/auth");
const blogRouter = express.Router();

// general endpoints
blogRouter.get("/", list_blogs);
blogRouter.get("/:id", get_single_blog);

// protected endpoints
blogRouter.use(protect);
blogRouter.post("/", create_Blog);
blogRouter.get("/my/list", get_my_blogs);
blogRouter.patch("/:id/state", update_blog_state);
blogRouter.patch("/:id", edit_blog);
blogRouter.delete("/:id", delete_blog);

module.exports = blogRouter;
