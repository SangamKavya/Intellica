import ProfessionalModule from "../../../components/ProfessionalModule";
import UploadActivity from "../../../components/UploadActivity";

function ProfessionalMembership({ onBack, facultyId, mode = "upload" }) {

  return (
    <ProfessionalModule
      title="Professional Membership"
      category="ProfessionalMembership"
      facultyId={facultyId}
      fetchUrl="http://localhost:5000/api/uploads/category"
      UploadComponent={(props) => (
        <UploadActivity
          category="ProfessionalMembership"
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

export default ProfessionalMembership;