import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function ResearchProjects({ onBack, facultyId, mode = "upload" }) {

  const UploadComponent = (props) => (
    <UploadActivity
      category="researchproject"
      facultyId={facultyId}
      {...props}
    />
  );

  return (
    <ProfessionalModule
      title="Research Projects"
      category="researchproject"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={UploadComponent}
      mode={mode}
      onBack={onBack}
      roleMode={facultyId ? "faculty" : "hod"}
    />
  );
}

export default ResearchProjects;