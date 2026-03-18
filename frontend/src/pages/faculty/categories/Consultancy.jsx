import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function Consultancy({ onBack, mode = "upload", facultyId = null }) {

  return (
    <ProfessionalModule
      title="Consultancy Projects"
      category="Consultancy"
      fetchUrl="http://localhost:5000/api/uploads/category"
      facultyId={facultyId}
      UploadComponent={(props) => (
        <UploadActivity category="Consultancy" {...props} />
      )}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );

}

export default Consultancy;