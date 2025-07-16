import { useContext, useRef } from "react";
import { PostList } from "@store/post-list-store";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { addPost } = useContext(PostList);
  const navigate = useNavigate();
  const userIdElement = useRef();
  const postTitleElement = useRef();
  const postBodyElement = useRef();
  const reactionsElementLikes = useRef();
  const reactionsElementDislikes = useRef();
  const tagsElement = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const userId = userIdElement.current.value;
    const postTitle = postTitleElement.current.value;
    const postBody = postBodyElement.current.value;
    const reactionsLike = reactionsElementLikes.current.value;
    const reactionsDislikes = reactionsElementDislikes.current.value;
    const reactions = {
      likes: reactionsLike,
      dislikes: reactionsDislikes,
    };
    const tags = tagsElement.current.value.split(" ");
    userIdElement.current.value = "";
    postTitleElement.current.value = "";
    postBodyElement.current.value = "";
    reactionsElementLikes.current.value = "";
    reactionsElementDislikes.current.value = "";
    tagsElement.current.value = "";
    addPost(userId, postTitle, postBody, reactions, tags);
    navigate("/");
  };
  return (
    <div className="mini-container" onSubmit={handleSubmit}>
      <form className="row g-3 ">
        <div className="col-md-7">
          <label htmlFor="inputPassword" className="form-label  Items">
            User Id*
          </label>
          <input
            ref={userIdElement}
            type="UserId"
            className="form-control"
            placeholder="user-1A@!"
          />
        </div>
        <div className="col-7">
          <label htmlFor="inputAddress" className="form-label Items">
            Post Title
          </label>
          <input
            type="text"
            ref={postTitleElement}
            className="form-control"
            id="inputAddress"
            placeholder="How are you feeling today..."
          />
        </div>
        <div className="col-7">
          <label htmlFor="inputAddress2" className="form-label Items">
            Post Content
          </label>
          <textarea
            ref={postBodyElement}
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="4"
            placeholder="Tell us more about it..."
          ></textarea>
        </div>

        <div className="reactions">
          <div className="col-3">
            <label htmlFor="inputCity" className="form-label Items">
              Likes
            </label>
            <input
              ref={reactionsElementLikes}
              type="text"
              className="form-control"
              id="inputCity"
              placeholder="How many likes are there..."
            />
          </div>
          <div className="col-3">
            <label htmlFor="inputCity" className="form-label Items">
              Dislikes
            </label>
            <input
              ref={reactionsElementDislikes}
              type="text"
              className="form-control"
              id="inputCity"
              placeholder="How many dislikes are there..."
            />
          </div>
        </div>
        <div className="col-md-7">
          <label htmlFor="inputCity" className="form-label Items">
            Enter your hashtags
          </label>
          <input
            ref={tagsElement}
            type="text"
            className="form-control"
            id="inputCity"
            placeholder="Enter tags using space.."
          />
        </div>
        <div className="col-7">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="gridCheck"
            />
            <label className="form-check-label" htmlFor="gridCheck">
              Remember me
            </label>
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-dark">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
