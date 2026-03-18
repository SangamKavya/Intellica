import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function Books({ onBack, mode = "upload", facultyId = null }) {

  const UploadComponent = (props) => (
    <UploadActivity category="Book" {...props} />
  );

  return (
    <ProfessionalModule
      title="Books"
      category="Book"
      fetchUrl="http://localhost:5000/api/uploads/category"
      facultyId={facultyId}
      UploadComponent={UploadComponent}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );

}

export default Books;