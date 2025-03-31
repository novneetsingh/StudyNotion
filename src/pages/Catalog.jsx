import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Common/Footer";
import CourseCard from "../components/core/Catalog/CourseCard";
import axios from "axios";

function Catalog() {
  // Get catalogName from URL parameters
  const { catalogName } = useParams();

  // Local state to store catalog page data and selected category ID
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // Fetch categories and find the category ID that matches the catalog name
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(`/course/showAllCategories`);

        // Find the category that matches the catalog name
        const category = res?.data?.data?.find(
          (category) =>
            category.name.split(" ").join("-").toLowerCase() === catalogName
        );

        if (category) {
          setCategoryId(category._id);
        } else {
          console.error(`Category with name ${catalogName} not found.`);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, [catalogName]);

  // Fetch catalog page data based on the selected category ID
  useEffect(() => {
    const fetchCatalogPage = async () => {
      if (categoryId) {
        try {
          const res = await axios.get(`/course/category/${categoryId}`);
          setCatalogPageData(res.data);
        } catch (error) {
          console.log("Error fetching catalog page data:", error);
        }
      }
    };

    fetchCatalogPage();
  }, [categoryId]);

  // Display loading spinner while fetching data
  if (!catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Destructure necessary data from the catalog page data
  const { name, description, courses } = catalogPageData?.data || {};

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">{name}</span>
          </p>
          <p className="text-3xl text-richblack-5 font-semibold">{name}</p>
          <p className="max-w-[870px] text-richblack-200">{description}</p>
        </div>
      </div>

      {/* Section 1: Courses to get started */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading mb-8">Courses to get you started</div>
        {courses?.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <CourseCard course={course} key={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-richblack-500">
            No courses available in this category yet. Please check back later.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Catalog;
