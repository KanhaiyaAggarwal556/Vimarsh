// components/Sections/HomeSection.tsx
import Post from "../../Single_Post/post";
import WelcomeMessage from "../../WelcomeMessage";
import LoadingSpinner from "../../Loading/LoadingSpinner";

// Use the same Post interface as in Posts.tsx for consistency
interface User {
  _id: string;
  userName: string;
  fullName: string;
  profilepic?: string;
}

interface PostData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  tags: string[];
  location: string;
  user: User;
  reactions: {
    likes: number;
    dislikes: number;
    shares: number;
    saves: number;
  };
  views: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HomeSectionProps {
  isActive: boolean;
  fetching: boolean;
  postList: PostData[];
  onRefetch?: () => void;
  onDeletePost?: (postId: string) => void; // Pass delete handler from parent
}

const HomeSection = ({
  isActive,
  fetching,
  postList,
  onRefetch,
  onDeletePost,
}: HomeSectionProps) => {
  console.log(postList);

  const handleGetPostClick = () => {
    // Refetch data if available
    if (onRefetch) {
      onRefetch();
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePostDelete = (postId: string) => {
    if (onDeletePost) {
      onDeletePost(postId);
    }
  };

  return (
    <div className={`section home-section ${isActive ? "active" : ""}`}>
      {fetching && <LoadingSpinner />}
      {!fetching && postList.length === 0 && (
        <WelcomeMessage onGetPostClick={handleGetPostClick} />
      )}
      {!fetching &&
        postList.map((post) => (
          <Post key={post._id} post={post} onDelete={handlePostDelete} />
        ))}
    </div>
  );
};

export default HomeSection;
