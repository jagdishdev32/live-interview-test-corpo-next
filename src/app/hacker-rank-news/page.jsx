"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const HackerRankNews = () => {
  const [newsIds, setNewsIds] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let numberofNewsFetched = newsList.length;
  let numberofNewsToFetchedInOneCall = 6;

  // newListObj = {
  //     id,
  //     data,   // If id present then call existing id data
  // }

  const fetchIds = async () => {
    try {
      const response = await axios.get(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );

      const data = response.data;
      setNewsIds(data);
      return data;
    } catch (error) {
      console.error("Fetch Ids Error: ", error);
    }
  };

  const fetchNewsWithIdIndexNumber = async (idIndexNumber) => {
    const idOfNews = newsIds?.[idIndexNumber];
    // If index number exceed limit.
    if (!idOfNews) return;
    try {
      const response = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${idOfNews}.json`
      );

      const data = response.data;

      return data;
    } catch (error) {
      console.error("Fetch Error: ", error);
    }
  };

  const fetchMoreNews = async () => {
    let startIndex = numberofNewsFetched;
    let endIndex = startIndex + numberofNewsToFetchedInOneCall - 1;

    // Check if the endIndex is under limit
    if (endIndex > newsIds.length) endIndex = newsIds.length;

    let listOfNewFetchItems = [];
    console.log("worked", startIndex, endIndex);
    console.log("newsIds", newsIds);
    for (let index = startIndex; index <= endIndex; index++) {
      // const
      const newsObj = await fetchNewsWithIdIndexNumber(index);
      if (newsObj) listOfNewFetchItems.push(newsObj);
    }

    setNewsList((prevList) => {
      return [...prevList, ...listOfNewFetchItems];
    });
  };

  useEffect(() => {
    let isFetched = false;

    const fetchInitialNew = async () => {
      try {
        if (!isFetched) {
          // Fetch Ids
          await fetchIds();

          // fetchMoreNews();
        }
      } catch (error) {
        console.error("Ids Fetch Failed: ", error);
        setIsLoading(false);
        alert("Fetching Ids failed");
      }
    };

    fetchInitialNew();

    return () => {
      isFetched = true;
    };
  }, []);

  useEffect(() => {
    let isFetched = false;
    if (newsIds) {
      const fetchInitialNew = async () => {
        try {
          if (!isFetched) {
            await fetchMoreNews();
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialNew();
    }

    return () => {
      isFetched = true;
    };
  }, [newsIds]);

  if (isLoading) {
    return (
      <div className="flex w-full h-[100vh] justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <div>
      <h1>Hacker News Job Board</h1>
      {/* The page should show 6 jobs on initial load with a button to load more
      postings. Clicking on the "Load more" button will load the next page of 6
      postings. The button does not appear if there aren't any more postings to
      load. If there's a url field returned for the job details, make the job
      title a link that opens the job details page in a new window when clicked.
      The timestamp can be formatted in any way you like. */}
      {/* <pre>{JSON.stringify(newsIds, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(newsList, null, 2)}</pre> */}
      <div className="flex gap-4 flex-col">
        {newsList?.map(({ title, url, time, by }, index) => {
          return (
            <div key={index} className="p-4 bg-gray-200">
              {index}
              <div>
                title: {title}
                <br />
                url: {url}
                <br />
                time: {time}
                <br />
                by: {by}
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={(event) => {
          event.preventDefault();
          fetchMoreNews();
        }}
        className="bg-blue-500 p-8 text-white"
      >
        Load More
      </button>

      <br />
      <br />
    </div>
  );
};

export default HackerRankNews;
