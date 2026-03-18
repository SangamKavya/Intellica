import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function ResearchPolicy({ onBack, facultyId, mode = "upload" }) {

  return (
    <ProfessionalModule
      title="Research Policy / R&D Committee"
      category="ResearchPolicy"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={(props) => (
        <UploadActivity
          category="ResearchPolicy"
          facultyId={facultyId}
          {...props}
        />
      )}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );

}

export default ResearchPolicy;