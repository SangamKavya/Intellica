import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function GuestLectures({ onBack, facultyId, mode = "upload" }) {

  const UploadComponent = (props) => (
    <UploadActivity
      category="GuestLecture"
      facultyId={facultyId}
      {...props}
    />
  );

  return (
    <ProfessionalModule
      title="Guest Lectures"
      category="GuestLecture"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={UploadComponent}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );

}

export default GuestLectures;