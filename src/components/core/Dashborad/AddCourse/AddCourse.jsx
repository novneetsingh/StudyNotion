import CourseInformationForm from "./CourseInformationForm";
import { useSelector } from "react-redux";
import CourseBuilderForm from "./CourseBuilderForm";

export default function AddCourse() {
  const { step } = useSelector((state) => state.course);

  return (
    <div className="flex-1 w-[60%] items-start gap-x-6">
      {/* Header */}
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Add Course
      </h1>

      {/* Main content where steps will be rendered */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
    </div>
  );
}
