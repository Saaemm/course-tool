import type { NextPage } from "next";
import React from "react";
import CourseList from "../components/CourseList";
import Aggregate from "../components/Aggregate";
import { useAppSelector } from "../app/hooks";
import { Page } from "../components/Page";

const SavedPage: NextPage = () => {
  const saved = useAppSelector((state) => state.user.bookmarked);
  const numSaved = saved.length;

  return (
    <Page
      activePage="saved"
      sidebar={
    <div>
      <Aggregate />
      <div className="flex items-baseline">
          <div className="mt-4 mr-4 whitespace-nowrap text-sm">
            Number of saved courses: {numSaved}
          </div>
        </div>
    </div>}
      content={
        <CourseList courseIDs={saved}>
          <div className="text-gray-400 mt-6 text-center">
            Nothing saved yet!
          </div>
        </CourseList>
      }
    />
  );
};

export default SavedPage;
