import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function Certifications({ onBack, mode = "upload", facultyId = null }) {

  return (
    <ProfessionalModule
      title="Certifications"
      category="Certification"
      fetchUrl="http://localhost:5000/api/uploads/category"
      facultyId={facultyId}
      UploadComponent={(props) => (
        <UploadActivity category="Certification" {...props} />
      )}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );

}

export default Certifications;