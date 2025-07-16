// components/Sections/HomeSection.js
import PropTypes from 'prop-types';
import Post from "../../Single_Post/post";
import WelcomeMessage from "../../WelcomeMessage";
import LoadingSpinner from "../../Loading/LoadingSpinner";

const HomeSection = ({ isActive, fetching, postList }) => {
  console.log(postList);
  return (
    <div className={`section home-section ${isActive ? "active" : ""}`}>
      {fetching && <LoadingSpinner />}
      {!fetching && postList.length === 0 && (
        <WelcomeMessage/>
      )}
      {!fetching &&
        postList.map((post) => <Post key={post.id} post={post} />)}
    </div>
  );
};

HomeSection.propTypes = {
  isActive: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  postList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default HomeSection;