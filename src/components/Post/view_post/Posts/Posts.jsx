// components/Posts/Posts.js
import { useContext, useState } from "react";
import { PostList as PostListData } from "@store/post-list-store";
import Header from "./Header/Header";
import HomeSection from "./Sections/HomeSection";
import MessagesSection from "./Sections/MessagesSection";
import useScroll from "../hooks/useScroll";
import "./styles/PostsStyles.css";

export default function Posts() {
  const { postList, fetching } = useContext(PostListData);
  const [activeSection, setActiveSection] = useState("home");
  const isScrolled = useScroll();

  const handleSectionToggle = (section) => {
    setActiveSection(section);
  };
  console.log(postList);
  return (
    <div className="posts-container">
      <Header 
        isScrolled={isScrolled}
        activeSection={activeSection}
        onSectionToggle={handleSectionToggle}
      />

      <div className="posts-content">
        <HomeSection 
          isActive={activeSection === "home"}
          fetching={fetching}
          postList={postList}
        />
        
        <MessagesSection 
          isActive={activeSection === "messages"}
        />
      </div>
    </div>
  );
}