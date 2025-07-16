import PropTypes from "prop-types";

export default function WelcomeMessage({ onGetPostClick }) {
  return (
    <div className="bg text-secondary px-4 py-5 text-center WelcomeMessage">
      <div className="py-5">
        <h1 className="display-5 fw-bold text-black ">Welcome to Twooter</h1>
        <div className="col-lg-6 mx-auto">
          <p className="fs-5 mb-4">
            This is a very unique and interesting social media platform where
            you can relax and have fun. On this website, you can learn about
            people&#39;s thoughts, get to know your friends, family, and the world.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button
              onClick={onGetPostClick}
              type="button"
              className="btn btn-outline-dark btn-lg px-4 me-sm-3 fw-bold"
            >
              View Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

WelcomeMessage.propTypes = {
  onGetPostClick: PropTypes.func.isRequired,
};