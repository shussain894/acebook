var mongoose = require("mongoose");

require("../mongodb_helper");
var Comment = require("../../models/comment");

describe("Comment model", () => {
  // beforeEach((done) => {
  //   mongoose.connection.collections.comment.drop(() => {
  //     done();
  //   });
  // });

  it("has a message", () => {
    var comment = new Comment({ text: "text comment added", user_id: "1", post_id: "2" });
    expect(comment.text).toEqual("text comment added");
    expect(comment.user_id).toEqual("1");
    expect(comment.post_id).toEqual("2");
  })

  it("can save a message", (done) => {
    var comment = new Comment({ text: "text comment added", user_id: "1", post_id: "2" });

    comment.save((err) => {
      expect(err).toBeNull();

      Comment.find((err, comments) => {
        expect(err).toBeNull();

        expect(comments[0]).toMatchObject({ text: "text comment added", user_id: "1", post_id: "2" });
        done();
      });
    });
  });
})

  