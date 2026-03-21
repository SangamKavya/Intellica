import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function Others({ onBack, mode = "upload", facultyId = null }) {

  const UploadComponent = (props) => (
    <UploadActivity category="Others" {...props} />
  );

  return (
    <ProfessionalModule
      title="Others"
      category="Others"
      fetchUrl="http://localhost:5000/api/uploads/category"
      facultyId={facultyId}
      UploadComponent={UploadComponent}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );
}

export default Others;